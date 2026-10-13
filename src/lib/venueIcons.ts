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
  leodex: { icon: `${D}/leodex-icon.png`, dark: `${D}/leodex-icon-dark.png` },
};

export function venueIcon(name: string): { icon?: string; dark?: string } {
  return ICONS[name.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? {};
}
