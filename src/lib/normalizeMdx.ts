export function normalizeMdx(markdown: string): string {
  return markdown.replace(/\sclass=/g, " className=");
}
