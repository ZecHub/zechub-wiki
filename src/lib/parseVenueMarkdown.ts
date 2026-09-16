export type Venue = {
  name: string;
  url: string;
  pairs?: string;
  support?: string;
  depositTime?: string;
  ironwood?: string;
  description?: string;
  logo: string;
  altText: string;
};

const DEFAULT_LOGO = "/content-images/_unavailable.svg";

const FIELD_ALIASES: Record<string, keyof Pick<
  Venue,
  "pairs" | "support" | "depositTime" | "ironwood" | "description" | "url" | "logo"
>> = {
  pairs: "pairs",
  pair: "pairs",
  supports: "support",
  support: "support",
  "deposit time": "depositTime",
  deposit: "depositTime",
  ironwood: "ironwood",
  description: "description",
  desc: "description",
  website: "url",
  url: "url",
  link: "url",
  logo: "logo",
  image: "logo",
  img: "logo",
};

const MD_LINK = /\[([^\]]+)\]\(([^)]+)\)/;
const HTML_IMG = /<img\b[^>]*>/i;
const SRC_ATTR = /\bsrc=["']([^"']+)["']/i;
const ALT_ATTR = /\balt=["']([^"']*)["']/i;

function stripMd(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(MD_LINK, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^[*_`]+|[*_`]+$/g, "")
    .trim();
}

function extractUrl(value: string): string | undefined {
  const md = value.match(MD_LINK);
  if (md?.[2]) return md[2].trim();
  const raw = value.match(/https?:\/\/\S+/);
  return raw?.[0]?.replace(/[).,]+$/, "");
}

function headingNameAndUrl(heading: string): { name: string; url?: string } {
  const cleaned = heading.replace(/^#+\s*/, "").trim();
  const md = cleaned.match(MD_LINK);
  if (md) return { name: stripMd(md[1]), url: md[2].trim() };
  return { name: stripMd(cleaned) };
}

function parseImg(block: string): { logo?: string; altText?: string } {
  const tag = block.match(HTML_IMG)?.[0];
  if (!tag) {
    const mdImg = block.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdImg) return { logo: mdImg[1].trim() };
    return {};
  }
  return {
    logo: tag.match(SRC_ATTR)?.[1],
    altText: tag.match(ALT_ATTR)?.[1],
  };
}

function applyField(venue: Venue, rawKey: string, rawVal: string) {
  const key = FIELD_ALIASES[rawKey.toLowerCase().trim()];
  if (!key) return;
  if (key === "url") {
    venue.url = extractUrl(rawVal) || stripMd(rawVal) || venue.url;
    return;
  }
  if (key === "logo") {
    venue.logo = extractUrl(rawVal) || stripMd(rawVal) || venue.logo;
    return;
  }
  const value = stripMd(rawVal);
  if (!value) return;
  venue[key] = value;
}

export function parseVenueMarkdown(markdown: string): Venue[] {
  if (!markdown?.trim()) return [];

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const venues: Venue[] = [];
  let current: { heading: string; body: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const { name, url } = headingNameAndUrl(current.heading);
    if (!name) return;

    const body = current.body.join("\n");
    const venue: Venue = {
      name,
      url: url || "",
      logo: DEFAULT_LOGO,
      altText: `${name} Logo`,
    };

    const img = parseImg(body);
    if (img.logo) venue.logo = img.logo;
    if (img.altText) venue.altText = img.altText;

    for (const line of current.body) {
      const bullet = line.match(/^\s*[-*]\s+([^:]+):\s*(.*)$/);
      if (bullet) applyField(venue, bullet[1], bullet[2]);
    }

    if (!venue.description) {
      const para = current.body
        .filter((line) => {
          const t = line.trim();
          if (!t) return false;
          if (t.startsWith("#")) return false;
          if (t.startsWith("<")) return false;
          if (t.startsWith("!") || t.startsWith("[")) return false;
          if (/^\s*[-*]\s+/.test(t)) return false;
          if (/^[-_*]{3,}$/.test(t)) return false;
          return true;
        })
        .join(" ")
        .trim();
      if (para) venue.description = stripMd(para);
    }

    if (venue.url || venue.pairs || venue.description) venues.push(venue);
  };

  for (const line of lines) {
    if (/^\s{0,3}#{2,3}\s+\S/.test(line)) {
      flush();
      current = { heading: line.trim(), body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  flush();

  return venues;
}
