"use client";
import Image from "next/image";
import Link from "next/link";
import { FadeInAnimation } from "../UI/FadeInAnimation";
import { useLanguage } from "@/context/LanguageContext";
import { ThemeImage } from "../UI/ThemeImage";

const ContentSections = () => {
  const { t } = useLanguage();
  
  return (
    <section className="flex space-y-24 flex-col w-full ">
      {/* Zcash Section */}

      <InfoCard
        id="what-is-zcash"
        title={t.home?.sections?.whatIsZcash?.title || "What is Zcash?"}
        description={t.home?.sections?.whatIsZcash?.description || "It is an open-source, blockchain ledger that features a sophisticated zero-knowledge proving system. It specializes in offering a higher standard of privacy through its proving system preserving confidentiality of transaction metadata. At its core, Zcash is private data ownership that is permissionlessly transferred when transactions are made."}
        image="/Zcashcard.png"
        imageLight="/explore/light/what-is-zcash.png"
        imageDark="/explore/dark/what-is-zcash.png"
        links={[
          {
            href: "/start-here/what-is-zec-and-zcash",
            label: t.home?.sections?.whatIsZcash?.mainLink || "What is Zcash?",
            primary: true,
          },
          {
            href: "/zcash-tech/zk-snarks",
            label: t.home?.sections?.whatIsZcash?.techLink || "Zcash Technology",
          },
        ]}
      />

      {/* Hackathon Section */}
      <InfoCard
        id="zcashme"
        reverse={true}
        title={t.home?.sections?.zcashMe?.title || "Zcash.me"}
        description={t.home?.sections?.zcashMe?.description || "Zcash.Me is a public directory of Zcash users featuring private messaging, leaderboards, and verified users. Connect, explore, and interact with the Zcash community."}
        image="/Zcash-me.png"
        imageLight="/explore/light/zcash-me.png"
        imageDark="/explore/dark/zcash-me.png"
        links={[
          {
            href: "https://zcash.me",
            label: t.home?.sections?.zcashMe?.link || "Visit Zcash.Me",
            primary: true,
          },
        ]}
      />
      {/* Global Ambassadors Section */}
      <InfoCard
        id="global-ambassadors"
        title={t.home?.sections?.globalAmbassadors?.title || "Zcash Global Ambassadors"}
        description={t.home?.sections?.globalAmbassadors?.description || "Zcash Global Ambassadors are community leaders dedicated to promoting privacy-focused cryptocurrency adoption and education worldwide. Each ambassador project focuses on building awareness and engagement within their respective regions."}
        image="/zcash-global-ambassadors.png"
        imageLight="/explore/light/zga.png"
        imageDark="/explore/dark/zga.png"
        links={[
          {
            href: "/zcash-global-ambassadors",
            label: t.home?.sections?.globalAmbassadors?.link || "Meet the Ambassadors",
            primary: true
          },
        ]}
      />
      {/* Shielded Newsletter Section */}
      <InfoCard
        id="shielded-newsletter"
        title={t.home?.sections?.newsletter?.title || "Shielded Newsletter"}
        description={t.home?.sections?.newsletter?.description || "Subscribe using your Unified Address to get shielded access to Zcash Ecosystem Updates & Network Stats direct to your wallet!"}
        image="/zcash_newsletter.gif"
        imageLight="/explore/light/shielded-newsletter.png"
        imageDark="/explore/dark/shielded-newsletter.png"
        links={[
          {
            href: "/newsletter",
            label: t.home?.sections?.newsletter?.link || "Subscribe",
            primary: true,
          },
        ]}
      />

      {/* Free2Z Section */}
      <InfoCard
        id="Free2Z"
        reverse={true}
        title={t.home?.sections?.free2z?.title || "Free2Z"}
        description={t.home?.sections?.free2z?.description || "Free2Z is a social platform powered by Zcash. With peer-to-peer donations, a revenue sharing program, advanced creative tools and a massive online global community."}
        image="/Free2z_Banner.gif"
        imageLight="/explore/light/free2z.png"
        imageDark="/explore/dark/free2z.png"
        links={[
          {
            href: "https://free2z.cash",
            label: t.home?.sections?.free2z?.link || "Free2Z",
            primary: true,
          },
        ]}
      />

      {/* Pay with Zcash Section */}
      <InfoCard
        id="pay-with-zcash"
        title={t.home?.sections?.payWithZcash?.title || "Pay with Zcash"}
        description={t.home?.sections?.payWithZcash?.description || "This website is an answer to the question: Where can I pay with Zcash? The directory is free to use. The items listed are for informational purposes only, and not endorsements of any kind. Enjoy!"}
        image="/paywithzcash.png"
        imageLight="/explore/light/pay-with-zcash.png"
        imageDark="/explore/dark/pay-with-zcash.png"
        links={[
          {
            href: "https://paywithz.cash",
            label: t.home?.sections?.payWithZcash?.mainLink || "paywithz.cash",
            primary: true,
          },
          {
            href: "https://zechub.wiki/map",
            label: t.home?.sections?.payWithZcash?.mapLink || "SPEDN",
          },
        ]}
      />

    </section>
  );
};

export default ContentSections;

type SectionProps = {};
function Section(props: SectionProps) {
  return (
    <div
      id="what-is-zcash"
      className="flex flex-col md:flex-row border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden"
    >
      {/* Left Column - Image */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-800 p-4">
        <FadeInAnimation>
          <Image
            src="/Zcashcard.png"
            alt="Zcash Card"
            width={500}
            height={500}
            className="max-w-full h-auto"
            unoptimized
          />
        </FadeInAnimation>
      </div>

      {/* Right Column - Content */}
      <div className="flex flex-col flex-1 p-6 space-y-8 items-center md:items-start justify-center text-center md:text-left">
        <FadeInAnimation>
          <h2 className="text-3xl my-4 font-semibold dark:text-slate-300">
            What is Zcash?
          </h2>
        </FadeInAnimation>

        <FadeInAnimation>
          <p className="mb-8 text-slate-700 dark:text-slate-300 leading-relaxed">
            It is an open-source, blockchain ledger that features a
            sophisticated zero-knowledge proving system. It specializes in
            offering a higher standard of privacy through its proving system
            preserving confidentiality of transaction metadata. At its core,
            Zcash is private data ownership that is permissionlessly transferred
            when transactions are made.
          </p>
        </FadeInAnimation>

        <FadeInAnimation className="w-full">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/start-here/what-is-zec-and-zcash"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              What is Zcash?
            </Link>
            <Link
              href="/zcash-tech/zk-snarks"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-blue-400 border border-blue-300 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-700"
            >
              Zcash Technology
            </Link>
          </div>
        </FadeInAnimation>
      </div>
    </div>
  );
}

interface InfoCardProps {
  id?: string;
  title: string;
  description: string;
  image: string;
  imageLight?: string;
  imageDark?: string;
  reverse?: boolean; // for reversing layout
  links: {
    href: string;
    label: string;
    primary?: boolean; // true for main CTA styling
  }[];
}

function InfoCard({
  id,
  title,
  description,
  image,
  imageLight,
  imageDark,
  links,
  reverse = false,
}: InfoCardProps) {
  const useThemeImage = imageLight != null || imageDark != null;

  return (
    <div
      id={id}
      className={`flex flex-col md:flex-row border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden ${reverse ? "md:flex-row-reverse" : ""
        }`}
    >
      {/* Left Column - Image */}
      <div className="flex flex-1 items-center justify-center  bg-slate-100 dark:bg-slate-800 p-6 min-h-[250px] ">
        <FadeInAnimation>
          {useThemeImage ? (
            <ThemeImage
              src={image}
              srcLight={imageLight}
              srcDark={imageDark}
              alt={title}
              width={500}
              height={500}
              className="max-w-full h-auto"
              unoptimized
            />
          ) : (
            <Image
              src={image}
              alt={title}
              width={500}
              height={500}
              className="max-w-full h-auto"
              unoptimized
            />
          )}
        </FadeInAnimation>
      </div>

      {/* Right Column - Content */}
      <div className="flex flex-col flex-1 p-6 space-y-6 items-center md:items-start justify-center text-center md:text-left">
        <FadeInAnimation>
          <h2 className="text-3xl mb-4 font-semibold dark:text-slate-300">
            {title}
          </h2>
        </FadeInAnimation>

        <FadeInAnimation>
          <p className="mb-5 text-slate-700 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </FadeInAnimation>

        <FadeInAnimation className="w-full mt-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex-1 inline-flex justify-center items-center px-4 py-4 text-md font-medium rounded-lg focus:ring-4 focus:outline-none
                  ${link.primary
                    ? "font-bold text-white bg-[#1984c7] hover:bg-[#1574af] focus:ring-[#1984c7]"
                    : "text-blue-400 border border-blue-300 hover:bg-blue-800 hover:text-white dark:border-[#1574af] dark:text-blue-300 dark:hover:bg-[#1574af]  focus:ring-blue-300 dark:focus:ring-[#1574af]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </FadeInAnimation>
      </div>
    </div>
  );
}
