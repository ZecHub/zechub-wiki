/**
 * The <script> tag merchants paste into their own site. It runs there, not on
 * zechub.wiki, so a relative src or data-api-base would resolve against the
 * merchant's domain: the script 404s and the widget never loads. Relative
 * values are therefore resolved against the configurator's origin.
 */
export interface EmbedSnippetConfig {
  address: string;
  amount: number | string;
  zecUsdRate: number | string;
  label: string;
  theme: string;
  target: string;
  disabled: boolean;
  apiBase: string;
}

export const absoluteUrl = (url: string, origin: string): string =>
  new URL(url, origin).toString().replace(/\/$/, "");

const escapeAttr = (value: unknown): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");

export function buildEmbedSnippet(
  config: EmbedSnippetConfig,
  scriptSrc: string,
  origin: string,
): string {
  const attrs: [string, unknown][] = [
    ["src", absoluteUrl(scriptSrc, origin)],
    ["data-address", config.address],
    ["data-amount", config.amount],
    ["data-zec-usd-rate", config.zecUsdRate],
    ["data-label", config.label],
    ["data-theme", config.theme],
    ["data-target", config.target],
    ["data-disabled", config.disabled],
    ["data-api-base", absoluteUrl(config.apiBase, origin)],
  ];
  const lines = attrs.map(([name, value]) => `  ${name}="${escapeAttr(value)}"`);
  return `<script\n${lines.join("\n")}\n></script>`;
}
