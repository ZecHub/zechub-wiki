import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getName, transformGithubFilePathToWikiLink } from "@/lib/helpers";
import { searcher } from "@/constants/searcher";
import { getResearchCardCover } from "@/constants/researchCardCovers";

const RESEARCH_IMG_LIGHT = "/explore/light/research.png";
const RESEARCH_IMG_DARK = "/explore/dark/research.png";

type Props = {
  roots: string[];
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
}: Props) {
  const articles = roots
    .filter((p) => p.endsWith(".md"))
    .map((filePath) => {
      const pathNoExt = filePath.replace(/\.md$/i, "");
      const wikiSlug = transformGithubFilePathToWikiLink(pathNoExt);
      const titleText = getName(pathNoExt);
      const desc = descriptionForWikiPath(wikiSlug);
      return { wikiSlug, title: titleText, desc, key: filePath };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

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
                  <h2 className="mt-1 text-lg font-bold text-foreground group-hover:underline">
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