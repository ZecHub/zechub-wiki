import Image from "next/image";

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
}: MdxContainerProps) {
  const lightSrc = heroImage?.src ?? defaultImgSource;
  const darkSrc = heroImage?.darkSrc ?? lightSrc;
  const width = heroImage?.width ?? 800;
  const height = heroImage?.height ?? 50;
  console.log(heroImage);

  return (
    <main>
      <div className="flex justify-center w-full mb-5 bg-transparent rounded pb-4">
        {/* Light mode image */}
        <Image
          className="w-full mb-5 object-cover dark:hidden"
          alt="wiki-banner"
          width={width}
          height={height}
          src={lightSrc}
        />
        {/* Dark mode image */}
        <Image
          className="w-full mb-5 object-cover hidden dark:block"
          alt="wiki-banner"
          width={width}
          height={height}
          src={darkSrc}
        />
      </div>

      <div
        id="content"
        className={`flex flex-col space-y-5 container m-auto ${
          roots && roots.length > 0
            ? "xl:flex-row xl:space-x-12"
            : "xl:flex-col"
        } h-auto pt-5 px-2`}
      >
        {hasSideMenu && (
          <div className="w-auto xl:w-2/5 relative">{sideMenu}</div>
        )}
        <section
          style={{ margin: "auto" }}
          className="h-auto w-full border-t xl:border-l p-3 dark:border-slate-400"
        >
          {children}
        </section>
      </div>
    </main>
  );
}
