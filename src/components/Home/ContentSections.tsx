import Image from "next/image";
import Link from "next/link";
import { FadeInAnimation } from "../UI/FadeInAnimation";

const ContentSections = () => {
  return (
    <section className="flex space-y-24 flex-col w-full ">
      {/* Zcash Section */}

      <InfoCard
        id="what-is-zcash"
        title="What is Zcash?"
        description="It is an open-source, blockchain ledger that features a sophisticated zero-knowledge proving system. It specializes in offering a higher standard of privacy through its proving system preserving confidentiality of transaction metadata. At its core, Zcash is private data ownership that is permissionlessly transferred when transactions are made."
        image="/Zcashcard.png"
        links={[
          {
            href: "/start-here/what-is-zec-and-zcash",
            label: "What is Zcash?",
            primary: true,
          },
          {
            href: "/zcash-tech/zk-snarks",
            label: "Zcash Technology",
          },
        ]}
      />

      {/* Hackathon Section */}
       <InfoCard
        id="zcashme"
        reverse={true}
        title="Zcash.me"
        description="Zcash.Me is a public directory of Zcash users featuring private messaging, leaderboards, and verified users. Connect, explore, and interact with the Zcash community."
        image="/Zcash-me.jpg"
        links={[
          {
            href: "https://zcash.me",
            label: " Visit Zcash.Me",
            primary: true,
          },
        ]}
      />

      {/* Shielded Newsletter Section */}
      <InfoCard
        id="shielded-newsletter"
        title="Shielded Newsletter"
        description="Subscribe using your Unified Address to get shielded access to
              Zcash Ecosystem Updates & Network Stats direct to your wallet!"
        image="/zcash_newsletter.gif"
        links={[
          {
            href: "/newsletter",
            label: "Subscribe",
            primary: true,
          },
        ]}
      />

      {/* Free2Z Section */}
      <InfoCard
        id="Free2Z"
        reverse={true}
        title="Free2Z"
        description="Free2Z is a social platform powered by Zcash. With peer-to-peer
              donations, a revenue sharing program, advanced creative tools and
              a massive online global community."
        image="/Free2z_Banner.gif"
        links={[
          {
            href: "https://free2z.cash",
            label: "Free2Z",
            primary: true,
          },
        ]}
      />

      {/* Pay with Zcash Section */}
      <InfoCard
        id="pay-with-zcash"
        title="Pay with Zcash"
        description="This website is an answer to the question: Where can I pay with Zcash?    
              The directory is free to use. The items listed are for
              informational purposes only, and not endorsements of any kind.
              Enjoy!"
        image="/paywithzcash.png"
        links={[
          {
            href: "https://paywithz.cash",
            label: "paywithz.cash",
            primary: true,
          },
          {
            href: "https://zechub.wiki/map",
            label: "SPEDN",
          },
        ]}
      />

      {/* ZECPages Section */}
      <InfoCard
        id="zec-pages"
        reverse={true}
        title="ZECPages"
        description="ZECPages is an anonymous message board powered by Zcash. It also
              serves as a public directory of Zcash users. Take it easy is the
              ZECpages motto. A good reason to swing by is if you want to chat
              and make new friends."
        image="/ZecPages_Banner.gif"
        links={[
          {
            href: "https://zecpages.com",
            label: "ZECPages",
            primary: true,
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
  links,
  reverse = false,
}: InfoCardProps) {
  return (
    <div
      id={id}
      className={`flex flex-col md:flex-row border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Left Column - Image */}
      <div className="flex flex-1 items-center justify-center  bg-slate-100 dark:bg-slate-800 p-6 min-h-[250px] ">
        <FadeInAnimation>
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="max-w-full h-auto"
            unoptimized
          />
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
                  ${
                    link.primary
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
