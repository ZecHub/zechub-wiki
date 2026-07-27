import type { MetadataRoute } from "next";

// AI / LLM crawlers we explicitly welcome. Decision: allow ALL of them — ZecHub
// wants its educational content discoverable by answer engines and model
// training alike. Each is listed by name (in addition to the catch-all `*`
// rule) so the intent is unambiguous to crawlers that only read their own
// named block, and each still honours the shared `/dao` disallow.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bingbot",
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everyone: crawl the whole wiki except the DAO section (kept private by
      // decision — mirrors the intent of the old, never-served root robots.txt).
      // `/dao` covers the unprefixed English route; `/*/dao` covers every
      // locale-prefixed variant (`/it/dao`, `/es/dao`, …).
      { userAgent: "*", allow: "/", disallow: ["/dao", "/*/dao"] },
      // Named AI crawlers — same permissive policy, spelled out.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/dao", "/*/dao"],
      })),
    ],
    sitemap: "https://zechub.wiki/sitemap.xml",
    host: "zechub.wiki",
  };
}
