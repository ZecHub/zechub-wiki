// Clean, transparent icons for exchanges (public/dex-logos). Venues without an
// entry show an initial instead of the screenshot used elsewhere in the content.
const D = "/dex-logos";
const ICONS: Record<string, { icon: string; dark?: string }> = {
  nearintents: { icon: `${D}/near-icon.png`, dark: `${D}/near-icon-dark.png` },
  stealthex: { icon: `${D}/stealthex-icon.png`, dark: `${D}/stealthex-icon-dark.png` },
  changelly: { icon: `${D}/changelly-icon.png`, dark: `${D}/changelly-icon-dark.png` },
  flypme: { icon: `${D}/flyp-icon.png`, dark: `${D}/flyp-icon-dark.png` },
  bisonwallet: { icon: `${D}/bison-icon.png`, dark: `${D}/bison-icon-dark.png` },
  bitcoinvn: { icon: `${D}/bitcoinvn-icon.png`, dark: `${D}/bitcoinvn-icon-dark.png` },
  firodex: { icon: `${D}/firo-icon.png` },
  exolix: { icon: `${D}/exolix-icon.png`, dark: `${D}/exolix-icon-dark.png` },
  xchange: { icon: `${D}/xchange-icon.png`, dark: `${D}/xchange-icon-dark.png` },
  trocodor: { icon: `${D}/trocador-icon.png` },
  trocador: { icon: `${D}/trocador-icon.png` },
  fixedfloat: { icon: `${D}/fixedfloat-icon.png`, dark: `${D}/fixedfloat-icon-dark.png` },
  changenow: { icon: `${D}/changenow-icon.png` },
  shapeshift: { icon: `${D}/shapeshift-icon.png`, dark: `${D}/shapeshift-icon-dark.png` },
  thorchain: { icon: `${D}/thorchain-icon.png` },
  thorswap: { icon: `${D}/thorswap-icon.png` },
  routerprotocol: { icon: `${D}/routerprotocol-icon.png` },
  peer: { icon: `${D}/peer-icon.png` },
  rocketx: { icon: `${D}/rocketx-icon.png`, dark: `${D}/rocketx-icon-dark.png` },
  loofta: { icon: `${D}/loofta-icon.png` },
  binance: { icon: `${D}/binance-icon.png` },
  kucoin: { icon: `${D}/kucoin-icon.png` },
  gemini: { icon: `${D}/gemini-icon.png` },
  kraken: { icon: `${D}/kraken-icon.png` },
  coinex: { icon: `${D}/coinex-icon.png` },
  bybit: { icon: `${D}/bybit-icon.png`, dark: `${D}/bybit-icon-dark.png` },
  coinbase: { icon: `${D}/coinbase-icon.png` },
  robinhood: { icon: `${D}/robinhood-icon.png` },
  okx: { icon: `${D}/okx-icon.png`, dark: `${D}/okx-icon-dark.png` },
  okex: { icon: `${D}/okx-icon.png`, dark: `${D}/okx-icon-dark.png` },
  htx: { icon: `${D}/htx-icon.png` },
  htxformerhuobi: { icon: `${D}/htx-icon.png` },
  huobi: { icon: `${D}/htx-icon.png` },
  bitfinex: { icon: `${D}/bitfinex-icon.png` },
  backpack: { icon: `${D}/backpack-icon.png` },
  nativeswap: { icon: `${D}/nativeswap-icon.png` },
  zcashtocash: { icon: `${D}/zcashtocash-icon.png`, dark: `${D}/zcashtocash-icon-dark.png` },
  leodex: { icon: `${D}/leodex-icon.png`, dark: `${D}/leodex-icon-dark.png` },
};

export function venueIcon(name: string): { icon?: string; dark?: string } {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (ICONS[key]) return ICONS[key];
  // Names such as "OKX (formerly OKEx)" or "HTX (former Huobi)": match by prefix.
  const hit = Object.keys(ICONS)
    .filter((k) => key.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return hit ? ICONS[hit] : {};
}
