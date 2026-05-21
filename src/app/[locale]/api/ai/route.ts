import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CHAT_MODEL, getOpenAIClient, hasOpenAIApiKey } from "@/lib/ai/openai";
import { searchDocs } from "@/lib/ai/vectorSearch";
import { checkRateLimit } from "@/lib/ai/rateLimit";
import type { ChatMessage, RetrievedDocChunk } from "@/lib/ai/types";

// Block Zcash private keys, seed phrases, and addresses from reaching OpenAI.
const SENSITIVE_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bu[a-z0-9]{80,}\b/i,       label: "Zcash unified address" },
  { pattern: /\bzs1[a-z0-9]{76,}\b/i,     label: "Zcash shielded address" },
  { pattern: /\bt1[a-zA-Z0-9]{33}\b/,     label: "Zcash transparent address" },
  { pattern: /\bzxviews[a-z0-9]{80,}\b/i, label: "Zcash viewing key" },
  { pattern: /\bsecret-spending-key\b/i,   label: "Zcash spending key" },
  { pattern: /\b([a-z]{3,8}\s){11,23}[a-z]{3,8}\b/, label: "seed phrase" },
  { pattern: /\b[0-9a-f]{60,}\b/i,        label: "private key" },
];

function containsSensitiveData(text: string): string | null {
  for (const { pattern, label } of SENSITIVE_PATTERNS) {
    if (pattern.test(text)) return label;
  }
  return null;
}

const RequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  pageUrl: z.string().url().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .optional(),
});

const REQUEST_TIMEOUT_MS = 60_000;

const SYSTEM_PROMPT_WITH_DOCS = `You are the ZecHub AI assistant — an expert on Zcash and the ZecHub wiki.
Answer the user's question using ONLY the documentation sections provided below.
Be concise and accurate. Do NOT reference "sections", "excerpts", or numbered sources in your answer.
After your answer, output exactly this block (replace the placeholder with the actual links given):

**Sources:**
{SOURCE_LINKS}`;

const SYSTEM_PROMPT_FALLBACK = `You are the ZecHub AI assistant — a knowledgeable assistant about Zcash, ZecHub, and the broader Zcash ecosystem.
The documentation search did not return results for this question, so answer from your general knowledge about Zcash and ZecHub.
Be accurate and helpful. Remind the user at the end of your answer that for the most up-to-date details they can visit zechub.wiki.`;

const OUT_OF_SCOPE_ANSWER =
  "I'm ZecHub AI, specialized in answering questions about the **ZecHub wiki** and the **Zcash ecosystem** — topics like shielded transactions, ZEC, wallets, privacy features, the ZecHub DAO, and community resources.\n\n" +
  "Your question doesn't seem to be related to those topics, so I can't provide a useful answer here.\n\n" +
  "If you have a question about Zcash or ZecHub, feel free to ask! You can also browse the full documentation at [zechub.wiki](https://zechub.wiki).";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

function getCallerIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function pathToWikiUrl(rawPath: string): string {
  const withoutExt = rawPath.replace(/\.md$/i, "");
  const pagePath = withoutExt
    .replace(/^zechub-wiki\//, "")
    .replace(/^zechub\//, "");
  return `https://zechub.wiki/${pagePath}`;
}

function pathToTitle(rawPath: string): string {
  const cleaned = rawPath
    .replace(/^zechub-wiki\//, "")
    .replace(/^zechub\//, "")
    .replace(/\.md$/i, "");

  const parts = cleaned.split("/").filter(Boolean);
  const relevant = parts.slice(-2);

  return relevant
    .map((seg) =>
      seg
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()
    )
    .join(" — ");
}

function buildContextBlock(chunks: RetrievedDocChunk[]): string {
  return chunks
    .map((c, i) => {
      const path = (c.metadata?.path as string) ?? "";
      const url = path ? pathToWikiUrl(path) : (c.metadata?.url as string) ?? "";
      const label = path ? pathToTitle(path) : "ZecHub Wiki";
      return `--- Section ${i + 1}: ${label} (${url}) ---\n${c.content}`;
    })
    .join("\n\n");
}

function buildSourceLinks(chunks: RetrievedDocChunk[]): string {
  const seen = new Set<string>();
  const links: string[] = [];

  for (const chunk of chunks) {
    const path = (chunk.metadata?.path as string) ?? "";
    const url = path ? pathToWikiUrl(path) : (chunk.metadata?.url as string) ?? "";
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const title = path ? pathToTitle(path) : "ZecHub Wiki";
    links.push(`- [${title}](${url})`);
  }

  return links.join("\n");
}

export async function POST(req: NextRequest) {
  const ip = getCallerIp(req);
  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { message, pageUrl, history = [] } = parsed.data;

  if (!hasOpenAIApiKey()) {
    return NextResponse.json(
      {
        error:
          "The AI assistant is temporarily unavailable because OPENAI_API_KEY is not configured on the server.",
      },
      { status: 503 }
    );
  }

  const sensitiveMatch = containsSensitiveData(message);
  if (sensitiveMatch) {
    return NextResponse.json(
      {
        error: `Your message appears to contain a ${sensitiveMatch}. For your security, private keys, seed phrases, and wallet addresses should never be shared with any third-party service.`,
      },
      { status: 400 }
    );
  }

  const requestStart = Date.now();
  console.log(`[/api/ai] → request | page=${pageUrl ?? "none"} | historyTurns=${history.length}`);

  try {
    const answer = await withTimeout(
      (async () => {
        const { chunks, searchAvailable, outOfScope } = await searchDocs(message, pageUrl);
        const hasContext = chunks.length > 0;

        if (outOfScope) {
          console.log("[/api/ai] mode=OUT_OF_SCOPE | skipping OpenAI call");
          return OUT_OF_SCOPE_ANSWER;
        }

        let systemPrompt: string;
        let contextInjection: string;

        if (hasContext) {
          const sourceLinks = buildSourceLinks(chunks);
          systemPrompt = SYSTEM_PROMPT_WITH_DOCS.replace("{SOURCE_LINKS}", sourceLinks);
          contextInjection = `Use the following documentation sections to answer:\n\n${buildContextBlock(chunks)}`;
          console.log(`[/api/ai] mode=RAG | chunks=${chunks.length} | searchAvailable=${searchAvailable}`);
        } else {
          systemPrompt = SYSTEM_PROMPT_FALLBACK;
          contextInjection =
            searchAvailable === null
              ? "Note: The documentation search is currently unavailable. Answer from general knowledge."
              : "Note: No documentation excerpts matched this query. Answer from general knowledge about Zcash and ZecHub.";
          console.log(`[/api/ai] mode=FALLBACK | chunks=0 | searchAvailable=${searchAvailable}`);
        }

        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
          { role: "system", content: systemPrompt },
          { role: "user", content: contextInjection },
          ...history.map((h: ChatMessage) => ({
            role: h.role as "user" | "assistant",
            content: h.content,
          })),
          { role: "user", content: message },
        ];

        const llmStart = Date.now();
        const openai = getOpenAIClient();
        const response = await openai.responses.create({
          model: CHAT_MODEL,
          input: messages,
        });
        console.log(`[/api/ai] OpenAI ok — ${Date.now() - llmStart}ms | model=${CHAT_MODEL}`);

        return response.output_text ?? "";
      })(),
      REQUEST_TIMEOUT_MS
    );

    console.log(`[/api/ai] ✓ done — total=${Date.now() - requestStart}ms`);
    return NextResponse.json({ answer });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
    const isTimeout = msg === "Request timed out";
    console.error(`[/api/ai] ✗ error — total=${Date.now() - requestStart}ms | ${msg}`);
    return NextResponse.json(
      { error: isTimeout ? "The request took too long. Try again." : "Failed to get answer." },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
