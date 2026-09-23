import type { MetadataRoute } from "next";

// AI / LLM crawlers we explicitly welcome. Decision: allow ALL of them — ZecHub
// wants its educational content discoverable by answer engines and model
// training alike. Each is listed by name (in addition to the catch-all `*`
// rule) so the intent is unambiguous to crawlers that only read their own
// named block, and each still honours the shared `/dao` disallow.
// Reconciled against each vendor's current crawler documentation (2026-09).
// Where a vendor separates "search index" from "model training", BOTH are
// listed and both are allowed — but they are grouped so the distinction stays
// visible if that decision is ever revisited, because blocking the search bot
// and blocking the training bot have very different consequences.
const AI_CRAWLERS = [
  // OpenAI — developers.openai.com/api/docs/bots
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // user-initiated fetch
  "GPTBot", // model training
  // Anthropic — support.claude.com "Does Anthropic crawl data from the web"
  "Claude-SearchBot", // search index; was missing, so it fell through to `*`
  "Claude-User", // user-initiated fetch
  "ClaudeBot", // model training
  // Perplexity — docs.perplexity.ai/docs/resources/perplexity-crawlers
  "PerplexityBot", // search index
  "Perplexity-User", // user-initiated fetch
  // Mistral — docs.mistral.ai/robots
  "MistralAI-Index", // search index
  "MistralAI-User", // user-initiated fetch
  // Google. Googlebot (the crawler that feeds Search, and therefore AI
  // Overviews) is covered by the `*` rule. Google-Extended is NOT a crawler —
  // it is a robots token that scopes Gemini training/grounding only, and per
  // Google's own docs it "does not impact a site's inclusion in Google Search".
  "Google-Extended",
  // Others
  "Bingbot", // feeds Copilot
  "CCBot", // Common Crawl
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
];
// Removed: `anthropic-ai` and `Claude-Web`, which Anthropic's current docs no
// longer list — they describe exactly three bots. Retired tokens cost nothing
// but they make the list look maintained when it isn't.

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
