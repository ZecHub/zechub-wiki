/**
 * Convert a menu-titles manifest key into the wiki route it represents.
 *
 * Keep this dependency-free because the same mapping is needed by server
 * features such as the sitemap and search-index builder. It intentionally
 * mirrors transformGithubFilePathToWikiLink in helpers.ts.
 */
export const keyToWikiPath = (key: string): string => {
  const wiki = key
    .replace("site/", "")
    .replace(/\w/g, (letter) => letter.toLowerCase())
    .replace(/_/g, "-")
    .replace(/\.md$/i, "");

  return "/" + wiki.replace(/^\/+/, "");
};
