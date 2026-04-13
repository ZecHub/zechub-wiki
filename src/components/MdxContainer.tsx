import Image from "next/image";
import Link from "next/link";
import ResearchArticleAside from "@/components/Research/ResearchArticleAside";

type MdxContainerProps = {
  roots: any;
  sideMenu: React.ReactNode;
  children: React.ReactNode;
  hasSideMenu: boolean;
  heroImage?: {
    src?: string;
    darkSrc?: string;
    width?: number;
    height?: number;
  };
  /** BitMEX-style editorial layout for research article pages. */
  layoutVariant?: "default" | "research";
  researchMeta?: {
    breadcrumbLabel: string;
    shareUrl: string;
    pageTitle: string;
  };
};

const defaultImgSource = "/wiki-banner.avif";

export default async function MdxContainer({
  heroImage = {
    src: defaultImgSource,
    darkSrc: defaultImgSource,
    width: 800,
    height: 50,
  },
  sideMenu,
  roots = [],
  hasSideMenu = false,
  children,
  layoutVariant = "default",
  researchMeta,
}: MdxContainerProps) {
  const lightSrc = heroImage?.src ?? defaultImgSource;
  const darkSrc = heroImage?.darkSrc ?? lightSrc;
  const width = heroImage?.width ?? 800;
  const height = heroImage?.height ?? 50;
  const isResearchArticle = layoutVariant === "research" && researchMeta;

  return (
    <main>
      {!isResearchArticle ? (
        <div className="mb-5 flex w-full justify-center rounded bg-transparent pb-4">
          {/* Light mode image */}
          <Image
            className="mb-5 w-full object-cover dark:hidden"
            alt="wiki-banner"
            width={width}
            height={height}
            src={lightSrc}
          />
          {/* Dark mode image */}
          <Image
            className="mb-5 hidden w-full object-cover dark:block"
            alt="wiki-banner"
            width={width}
            height={height}
            src={darkSrc}
          />
        </div>
      ) : null}

      <div
        id="content"
        className={`container m-auto flex h-auto flex-col space-y-5 px-2 pt-5 ${
          hasSideMenu && roots && roots.length > 0
            ? "xl:flex-row xl:space-x-12"
            : "xl:flex-col"
        }`}
      >
        {hasSideMenu && (
          <div className="relative w-auto xl:w-2/5">{sideMenu}</div>
        )}
        <div
          className={`flex min-w-0 flex-1 flex-col gap-10 lg:gap-12 ${
            isResearchArticle ? "xl:flex-row xl:items-start" : ""
          }`}
        >
          <section
            style={{ margin: "auto" }}
            className={`h-auto w-full border-t p-3 dark:border-slate-400 ${
              hasSideMenu ? "xl:border-l" : ""
            } ${isResearchArticle ? "xl:flex-1" : ""}`}
          >
            {isResearchArticle && researchMeta ? (
              <>
                <nav
                  className="mb-6 text-xs font-medium text-muted-foreground"
                  aria-label="Breadcrumb"
                >
                  <ol className="flex flex-wrap items-center gap-1.5">
                    <li>
                      <Link href="/" className="transition-colors hover:text-foreground">
                        Wiki
                      </Link>
                    </li>
                    <li aria-hidden className="text-muted-foreground/80">
                      /
                    </li>
                    <li>
                      <Link href="/research" className="transition-colors hover:text-foreground">
                        Research
                      </Link>
                    </li>
                    <li aria-hidden className="text-muted-foreground/80">
                      /
                    </li>
                    <li className="text-foreground/90">{researchMeta.breadcrumbLabel}</li>
                  </ol>
                </nav>
                <div className="max-w-none [&_img]:max-w-full [&_img]:rounded-lg">{children}</div>
              </>
            ) : (
              children
            )}
          </section>
          {isResearchArticle && researchMeta ? (
            <ResearchArticleAside title={researchMeta.pageTitle} shareUrl={researchMeta.shareUrl} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
