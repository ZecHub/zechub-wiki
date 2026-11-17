// Interfaces: whole looks for the wiki (type, spacing, shape, motion), picked
// in the header's Appearance menu above Mode. Separate from colour themes: an
// interface never sets colours, so every interface works with every colour
// theme in light and dark mode.
//
// Adding one: write src/components/Interfaces/<id>.css with every rule scoped
// to :root[data-interface="<id>"], import it in src/components/Interfaces/index.css,
// and add an entry below. See src/components/Interfaces/README.md.

export const INTERFACE_KEY = "zechub-interface";
export const DATA_ATTRIBUTE = "data-interface";

export interface InterfaceOption {
  /** Value of data-interface on <html>, and what is saved for the visitor. */
  id: string;
  /** Name shown in the Appearance menu. */
  name: string;
  /** One short line under the name. */
  hint: string;
  /** CSS font-family for the "Aa" sample in the menu. */
  sampleFont: string;
  embedUrl?: string;
}

export const DESKTOP_INTERFACE_URL =
  process.env.NEXT_PUBLIC_DESKTOP_INTERFACE_URL ||
  "https://zechub-wiki-workspace.vercel.app";

export const INTERFACES: readonly InterfaceOption[] = [
  {
    id: "classic",
    name: "Classic",
    hint: "The standard ZecHub look",
    sampleFont: "var(--font-heading), ui-monospace, monospace",
  },
  {
    id: "reader",
    name: "Reader",
    hint: "Serif type, a calm column, less motion",
    sampleFont: "var(--font-reader), Georgia, serif",
  },
  {
    id: "desktop",
    name: "Desktop",
    hint: "The full wiki as a Mac-style desktop",
    sampleFont: "ui-serif, Georgia, 'Times New Roman', serif",
    embedUrl: DESKTOP_INTERFACE_URL,
  },
];

export const DEFAULT_INTERFACE = INTERFACES[0].id;

export function isInterfaceId(value: unknown): value is string {
  return typeof value === "string" && INTERFACES.some((i) => i.id === value);
}

/** Sets or clears data-interface on <html>. The default needs no attribute. */
export function applyInterface(id: string, root: HTMLElement = document.documentElement): void {
  if (!isInterfaceId(id) || id === DEFAULT_INTERFACE) root.removeAttribute(DATA_ATTRIBUTE);
  else root.setAttribute(DATA_ATTRIBUTE, id);
}

/** The visitor's saved interface, or the default when nothing valid is saved. */
export function savedInterface(storage: Pick<Storage, "getItem"> | null = safeStorage()): string {
  try {
    const saved = storage?.getItem(INTERFACE_KEY);
    return isInterfaceId(saved) ? saved : DEFAULT_INTERFACE;
  } catch {
    return DEFAULT_INTERFACE;
  }
}

export function saveInterface(id: string, storage: Pick<Storage, "setItem"> | null = safeStorage()): void {
  if (!isInterfaceId(id)) return;
  try {
    storage?.setItem(INTERFACE_KEY, id);
  } catch {
    /* storage unavailable: the choice lasts for this page only */
  }
}

function safeStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
