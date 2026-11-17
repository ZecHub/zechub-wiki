// Page text for the two gallery pages. The source files are a bare link and a component call (the
// infographics page has no title at all), so the title, a one-line description and the component are
// written here; the images and the tab switcher come from the Gallery component itself.
const frontmatter = (md: string): string => md.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";

export function rewriteGalleryPage(original: string): string {
  if (!/<Gallery\s*\/>/.test(original) || /set="/.test(original)) return original;
  return `${frontmatter(original)}
# Zcash Wallpaper Gallery

Free Zcash wallpapers for your desktop, each a 1920 × 1080 image. Select one to preview it and download the full-size file.

<Gallery />
`;
}

export function rewriteInfographicsPage(original: string): string {
  if (!/<Gallery\s+set="infographics"\s*\/>/.test(original)) return original;
  return `${frontmatter(original)}
# Zcash Infographics

Visual explainers on Zcash topics, from encrypted memos and value pools to the roadmap. Select one to enlarge it and download the file.

<Gallery set="infographics" />
`;
}
