import Image from "next/image";

type MdxContainerProps = {
  roots: any;
  sideMenu: React.ReactNode;
  children: React.ReactNode;
  hasSideMenu: boolean;
  heroImage?: {
    src?: string;
    width?: number;
    height?: number;
  };
};

const defaultImgSource = "/wiki-banner.avif";

export default async function MdxContainer({
  heroImage = { src: defaultImgSource, width: 800, height: 50 },
  sideMenu,
  roots = [],
  hasSideMenu = false,
  children,
}: MdxContainerProps) {


  return (
    <main>
      <div className="flex justify-center w-full mb-5 bg-transparent rounded pb-4">
        <Image
          className="w-full mb-5 object-cover"
          alt="wiki-banner"
          width={heroImage?.width || 800}
          height={heroImage?.height || 50}
          src={heroImage?.src != undefined ? heroImage.src : defaultImgSource}
        />
      </div>

      <div
        id="content"
        className={`flex flex-col space-y-5 container m-auto ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-12" : "md:flex-col"
        } h-auto pt-5 px-2`}
      >
        {hasSideMenu && (
          <div className="w-auto md:w-2/5 relative">{sideMenu}</div>
        )}
        <section className="h-auto w-full border-t md:border-l p-3 dark:border-slate-400">
          {children}
        </section>
      </div>
    </main>
  );
}