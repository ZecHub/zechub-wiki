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

const FIELD_ALIASES: Record<
  string,
  keyof Pick<
    Venue,
    | "pairs"
    | "support"
    | "depositTime"
    | "ironwood"
    | "description"
    | "url"
    | "logo"
  >
> = {
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

  // --- localized labels -------------------------------------------------
  // The venue pages are translated into 18 locales, and the bullet LABELS are
  // translated with them. Lookup was English-only, so applyField() dropped
  // every field on a translated page. What that cost, per locale:
  //
  //   fr  worked by luck — its translation kept the word "Description"
  //   de  cards rendered with NO description (the heading still yielded a URL,
  //       so the venue survived the push guard but had nothing to show)
  //   it/es/pt/ar/zh/hi/…  parsed to zero venues, so getVenuesFromMarkdown()
  //       fell back to the hardcoded English dexListingConfig and served
  //       English cards under every locale prefix
  //
  // Derived from the corpus rather than written by hand: every label that
  // appears in translations/<loc>/site/Using_Zcash/{Custodial_Exchanges,DEX,
  // Centralized_Swaps}.md, aligned against the English bullet it replaces.
  // Some locales use more than one word for a field across pages, so several
  // aliases can map to the same key. Keys are lowercased with JS semantics
  // (Turkish "İşlem çiftleri" lowercases to "i̇şlem çiftleri", with a combining
  // dot) because applyField() looks up rawKey.toLowerCase().
  // url
  "ebe nrụọrụ weebụ": "url",
  "intanɛt so": "url",
  nyatakakadzraɖoƒe: "url",
  "oju opo wẹẹbu": "url",
  "ojú-ìwé": "url",
  "site web": "url",
  "sitio web": "url",
  "sito web": "url",
  tovuti: "url",
  "web sitesi": "url",
  weebụsaịtị: "url",
  wɛbsaet: "url",
  "веб-сайт": "url",
  вебсайт: "url",
  "الموقع الإلكتروني": "url",
  वेबसाइट: "url",
  ウェブサイト: "url",
  网站: "url",
  웹사이트: "url",
  // pairs
  "abụọ abụọ": "pairs",
  "atsu kple asi": "pairs",
  coppie: "pairs",
  handelspaare: "pairs",
  jozi: "pairs",
  "nnipa baanu": "pairs",
  "nnua abien": "pairs",
  paires: "pairs",
  pares: "pairs",
  "àwọn méjì": "pairs",
  "àwọn méjì-méjì": "pairs",
  "i̇şlem çiftleri": "pairs",
  пари: "pairs",
  пары: "pairs",
  الأزواج: "pairs",
  जोड़े: "pairs",
  交易对: "pairs",
  取引ペア: "pairs",
  거래쌍: "pairs",
  // support
  "awọn atilẹyin": "support",
  "compatible con": "support",
  destekler: "support",
  inasaidia: "support",
  kpekpeɖeŋunana: "support",
  mmoa: "support",
  nkwado: "support",
  "nneɛma a wɔboa": "support",
  "prend en charge": "support",
  suporta: "support",
  supporta: "support",
  unterstützt: "support",
  usaidizi: "support",
  "àwọn àtìlẹ́yìn": "support",
  поддержка: "support",
  підтримка: "support",
  يدعم: "support",
  समर्थित: "support",
  対応: "support",
  支持: "support",
  지원: "support",
  // depositTime
  "akoko idogo": "depositTime",
  "bere a wɔde sie": "depositTime",
  "bere a wɔde siesie nneɛma": "depositTime",
  "bere a wɔde sika siesie": "depositTime",
  "délai de dépôt": "depositTime",
  einzahlungszeit: "depositTime",
  "muda wa kuweka amana": "depositTime",
  "muda wa kuweka pesa": "depositTime",
  "oge mgbazinye ego": "depositTime",
  "oge nkwụnye ego": "depositTime",
  "tempo de depósito": "depositTime",
  "tempo di deposito": "depositTime",
  "tiempo de depósito": "depositTime",
  "yatırma süresi": "depositTime",
  "àkókò ìdókòwò": "depositTime",
  "àkókò ìfipamọ́": "depositTime",
  "ɣeyiɣi si woade gadzraɖoƒe": "depositTime",
  "ɣeyiɣi si woatsɔ ade asie": "depositTime",
  "ɣeyiɣi si woatsɔ ade gadzraɖoƒe": "depositTime",
  "ɣeyiɣi si woatsɔ ga de asi": "depositTime",
  "ɣeyiɣi si woatsɔ gade asi": "depositTime",
  "ɣeyiɣi si wotsɔ de gadzraɖoƒe": "depositTime",
  "время зачисления": "depositTime",
  "час депозиту": "depositTime",
  "وقت الإيداع": "depositTime",
  "जमा समय": "depositTime",
  充值时间: "depositTime",
  入金時間: "depositTime",
  "입금 시간": "depositTime",
  // ironwood
  "igi irin": "ironwood",
  // description
  açıklama: "description",
  beschreibung: "description",
  descripción: "description",
  descrizione: "description",
  descrição: "description",
  maelezo: "description",
  nkowasi: "description",
  nkọwa: "description",
  "nu si wòfia": "description",
  numeɖeɖe: "description",
  àlàyé: "description",
  àpèjúwe: "description",
  ŋutinya: "description",
  опис: "description",
  описание: "description",
  الوصف: "description",
  विवरण: "description",
  描述: "description",
  説明: "description",
  설명: "description",
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
      // Accept the full-width colon too. Chinese writes "网站：https://…", and
      // with an ASCII-only separator this regex matched the colon inside the
      // URL instead: the key came out as "网站：https" and the value as a
      // fragment, so every zh venue lost its fields.
      const bullet = line.match(/^\s*[-*]\s+([^:：]+)[:：]\s*(.*)$/);
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
