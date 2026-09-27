import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getName, transformGithubFilePathToWikiLink } from "@/lib/helpers";
import { searcher } from "@/constants/searcher";
import { getResearchCardCover } from "@/constants/researchCardCovers";

const RESEARCH_IMG_LIGHT = "/explore/light/research.png";
const RESEARCH_IMG_DARK = "/explore/dark/research.png";

type Props = {
  roots: string[];
  /**
   * Localized page titles from translation/menu-titles, keyed by the
   * site-relative path with ".md" (e.g. "Research/Foo.md"), with the English
   * manifest as fallback — the same pair SideMenu resolves against elsewhere.
   * Research routes render no sidebar (showSideMenu excludes them), so without
   * these the cards are the only page titles a reader sees, and every one was
   * derived from the filename and stayed English in all 18 locales even though
   * the translated title already existed in the manifest.
   */
  titles?: Record<string, string>;
  enTitles?: Record<string, string>;
  dynamicCovers?: Record<string, { src: string; alt?: string }>;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
};

function descriptionForWikiPath(wikiPath: string): string {
  const normalized = wikiPath.startsWith("/") ? wikiPath : `/${wikiPath}`;
  const hit = searcher.find((entry) => entry.url === normalized);
  return hit?.desc?.trim() ?? "";
}

export default function ResearchIndexGrid({
  roots,
  dynamicCovers = {},
  showHeader = true,
  title = "Research",
  subtitle = "Articles and notes from the ZecHub community.",
  titles = {},
  enTitles = {},
}: Props) {
  const articles = roots
    .filter((p) => p.endsWith(".md"))
    .map((filePath) => {
      const pathNoExt = filePath.replace(/\.md$/i, "");
      const wikiSlug = transformGithubFilePathToWikiLink(pathNoExt);
      // Manifest key is the site-relative path with the extension, exactly as
      // SideMenu builds it. SideMenu additionally prefers the short filename
      // when a title exceeds 36 chars, because a long one wraps its narrow
      // column; a card is wider, so the real title is used and clamped to two
      // lines instead (manifest titles reach 132 chars).
      const manifestKey = pathNoExt.replace(/^\/?site\//, "") + ".md";
      const titleText =
        titles[manifestKey] ?? enTitles[manifestKey] ?? getName(pathNoExt);
      const desc = descriptionForWikiPath(wikiSlug);
      return { wikiSlug, title: titleText, desc, key: filePath };
    })
    // Sort on the FILE PATH, not the displayed title. Titles used to be derived
    // from the filename, so alphabetical order happened to equal the numbered
    // order of a series ("Article 0 …", "Article 1 …"). Real manifest titles
    // break that: sorting a foundations series by its H1 renders 2,1,3,0,4,6,5
    // in English and a different scramble per locale. Path order is the
    // author's order and is identical in every language.
    .sort((a, b) => a.key.localeCompare(b.key));

  if (articles.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">No research articles are available yet.</p>
      </div>
    );
  }

  return (
    <div className="px-2 pb-8">
      {showHeader && (
        <>
          <h1 className="mb-2 text-4xl font-bold capitalize">{title}</h1>
          <p className="mb-10 text-lg text-muted-foreground">{subtitle}</p>
        </>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map(({ wikiSlug, title: articleTitle, desc, key }) => {
          const staticCover = getResearchCardCover(wikiSlug);
          const cover = staticCover || dynamicCovers[wikiSlug];

          return (
            <li key={key}>
              <Link
                href={`/${wikiSlug}#content`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-background transition-all active:scale-[0.985] sm:hover:border-slate-300 sm:hover:shadow-lg dark:border-slate-700 dark:sm:hover:border-slate-600"
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
                  {cover ? (
                    // Dynamic cover from GitHub → use native <img> to avoid Turbopack panic
                    <img
                      src={cover.src}
                      alt={cover.alt || articleTitle}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <Image
                        src={RESEARCH_IMG_LIGHT}
                        alt=""
                        width={640}
                        height={360}
                        className="h-full w-full object-cover dark:hidden"
                      />
                      <Image
                        src={RESEARCH_IMG_DARK}
                        alt=""
                        width={640}
                        height={360}
                        className="hidden h-full w-full object-cover dark:block"
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Research
                  </p>
                  <h2 className="mt-1 line-clamp-2 text-lg font-bold text-foreground group-hover:underline">
                    {articleTitle}
                  </h2>
                  {desc ? (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {desc}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}