import Image from "next/image";
import Link from "next/link";
import { FadeInAnimation } from "../UI/FadeInAnimation";

const ContentSections = () => {
  return (
    <section className="flex space-y-24 flex-col w-full px-5 my-12">
      {/* Zcash Section */}
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
        <div className="flex flex-col flex-1 p-6 space-y-6 items-center md:items-start justify-center text-center md:text-left">
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
              Zcash is private data ownership that is permissionlessly
              transferred when transactions are made.
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
      {/* <div className="flex flex-col space-y-4 md:flex-row min-h-screen w-auto border-2 border-[#E4A100]/50 rounded-md p-5">
            <div className="flex flex-1 items-center justify-center w-auto md:w-2/4">
              <FadeInAnimation>
                <Image
                  src={'/Zcashcard.png'}
                  alt=""
                  width={500}
                  height={50}
                  unoptimized={true}
                />
              </FadeInAnimation>
            </div>

            <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
              <FadeInAnimation>
                <h1 className="text-3xl text-center mb-4 w-full font-semibold">
                  What is Zcash?
                </h1>
              </FadeInAnimation>
              <FadeInAnimation>
                <p className="text-center w-full mb-5">
                  It is an open-source, blockchain ledger that features a
                  sophisticated zero-knowledge proving system. It specializes in
                  offering a higher standard of privacy through its proving
                  system preserving confidentiality of transaction metadata. At
                  its core, Zcash is private data ownership that is
                  permissionlessly transferred when transactions are made.
                </p>
              </FadeInAnimation>
              <FadeInAnimation className="w-full">
                <div className="flex flex-col md:flex-row mt-4 w-full">
                  <Link
                    href={'/start-here/what-is-zec-and-zcash'}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-bold text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    What is Zcash?
                  </Link>
                  &nbsp;
                  <Link
                    href={'/zcash-tech/zk-snarks'}
                    className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-blue-400 border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Zcash Technology
                  </Link>
                </div>
              </FadeInAnimation>
            </div>
          </div> */}

      {/* Hackathon Section */}
      <InfoCard
        id="hackathon"
        reverse={true}
        title="Hackathon"
        description="Challenge yourself to build with Zcash — the foundation of unstoppable, private money. Harness cutting-edge cryptography, empower true financial freedom, and shape the future of privacy-focused innovation."
        image="/hackathon.png"
        links={[
          {
            href: "https://hackathon.zechub.wiki",
            label: " Join the Hackathon",
            primary: true,
          },
        ]}
      />
      {/* <div
        className="flex flex-col md:flex-row space-y-4 h-96 my-4 w-full border-cyan-400/50 border-2 rounded-md p-5"
        style={{ height: "30rem" }}
      >
        <div className="flex justify-center items-center w-auto md:w-2/4">
          <FadeInAnimation>
            <Image
              src={"/hackathon.png"}
              alt=""
              width={350}
              height={350}
              unoptimized={true}
            />
          </FadeInAnimation>
        </div>
        <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
          <FadeInAnimation>
            <h1 className="text-3xl mb-4 font-semibold">Hackathon</h1>
          </FadeInAnimation>
          <FadeInAnimation>
            <p className="text-center mb-5">
              Challenge yourself to build with Zcash. Unstoppable Private Money.
            </p>
          </FadeInAnimation>
          <div className="flex flex-row space-x-4 mt-4">
            <FadeInAnimation>
              <Link
                href={"https://hackathon.zechub.wiki"}
                className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Join the Hackathon
              </Link>
            </FadeInAnimation>
          </div>
        </div>
      </div> */}

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
      {/* <div
        className="flex flex-col md:flex-row space-y-4 h-96 my-4 w-full border-black border-2 rounded-md p-5"
        style={{ height: "30rem", borderColor: "revert" }}
      >
        <div className="flex justify-center items-center w-auto md:w-2/4">
          <FadeInAnimation>
            <Image
              src={"/zcash_newsletter.gif"}
              alt=""
              width={500}
              height={50}
              unoptimized={true}
            />
          </FadeInAnimation>
        </div>
        <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
          <FadeInAnimation>
            <h1
              style={{ fontSize: "1.85rem" }}
              className="text-3xl mb-4 font-semibold"
            >
              Shielded Newsletter
            </h1>
          </FadeInAnimation>
          <FadeInAnimation>
            <p className="text-center mb-5">
              Subscribe using your Unified Address to get shielded access to
              Zcash Ecosystem Updates & Network Stats direct to your wallet!
            </p>
          </FadeInAnimation>
          <div className="flex flex-row space-x-4 mt-4">
            <FadeInAnimation>
              <Link
                href={"/newsletter"}
                className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Subscribe
              </Link>
            </FadeInAnimation>
          </div>
        </div>
      </div> */}

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
      {/* <div
        className="flex flex-col md:flex-row space-y-4 h-96 my-4 w-full border-cyan-400/50 border-2 rounded-md p-5"
        style={{ height: "30rem" }}
      >
        <div className="flex justify-center items-center w-auto md:w-2/4">
          <FadeInAnimation>
            <Image
              src={"/Free2z_Banner.gif"}
              alt=""
              width={500}
              height={50}
              unoptimized={true}
            />
          </FadeInAnimation>
        </div>
        <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
          <FadeInAnimation>
            <h1 className="text-3xl mb-4 font-semibold">Free2Z</h1>
          </FadeInAnimation>
          <FadeInAnimation>
            <p className="text-center mb-5">
              Free2Z is a social platform powered by Zcash. With peer-to-peer
              donations, a revenue sharing program, advanced creative tools and
              a massive online global community.
            </p>
          </FadeInAnimation>
          <div className="flex flex-row space-x-4 mt-4">
            <FadeInAnimation>
              <Link
                href={"https://free2z.cash"}
                className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Free2Z
              </Link>
            </FadeInAnimation>
          </div>
        </div>
      </div> */}

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
      {/* <div
        className="flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto border-2 border-black/50 rounded-md p-5"
        style={{ height: "30rem", borderColor: "revert" }}
      >
        <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
          <FadeInAnimation>
            <h1 className="text-3xl mb-4 font-semibold">Pay with Zcash</h1>
          </FadeInAnimation>
          <FadeInAnimation>
            <p className="text-center">
              This website is an answer to the question:{" "}
              <strong>where can I pay with Zcash?</strong>
            </p>
            <p className="text-center mb-5">
              The directory is free to use. The items listed are for
              informational purposes only, and not endorsements of any kind.
              Enjoy!
            </p>
          </FadeInAnimation>
          <FadeInAnimation>
            <div className="flex flex-row space-x-4 mt-4">
              <Link
                href={"https://paywithz.cash/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                paywithz.cash
              </Link>
              <Link
                href={"https://zechub.wiki/map"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center border-pink-500 border-2 rounded-lg bg-transparent hover:bg-pink-500 hover:shadow-[0px_0px_15px_rgba(255,105,180,0.5)] focus:ring-4 focus:outline-none focus:ring-pink-200"
              >
                <Image src={"/spedn.png"} alt="Spedn" width={80} height={30} />
              </Link>
            </div>
          </FadeInAnimation>
        </div>
        <div className="flex justify-center items-center w-9/12 md:w-2/4 self-center pt-8 md:pt-0">
          <FadeInAnimation>
            <Image
              className="w-50 h-auto"
              src={"/paywithzcash.png"}
              alt="paywithz.cash"
              width={400}
              height={40}
            />
          </FadeInAnimation>
        </div>
      </div> */}

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
      {/* <div
        className="flex flex-col md:flex-row space-y-4 h-screen my-4 w-auto border-2 border-black/50 rounded-md p-5"
        style={{ height: "30rem", borderColor: "revert" }}
      >
        <div className="flex flex-col w-auto md:w-2/4 items-center justify-center">
          <FadeInAnimation>
            <h1 className="text-3xl mb-4 font-semibold">ZECPages</h1>
          </FadeInAnimation>
          <FadeInAnimation>
            <p className="text-center mb-5">
              ZECPages is an anonymous message board powered by Zcash. It also
              serves as a public directory of Zcash users. Take it easy is the
              ZECpages motto. A good reason to swing by is if you want to chat
              and make new friends.
            </p>
          </FadeInAnimation>
          <FadeInAnimation>
            <div className="flex flex-row space-x-4 mt-4">
              <Link
                href={"https://zecpages.com"}
                className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-semibold text-center border-blue-300 border-2 rounded-lg hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                ZECPages
              </Link>
            </div>
          </FadeInAnimation>
        </div>
        <div className="flex justify-center items-center w-auto md:w-2/4 ">
          <FadeInAnimation>
            <Image
              className="w-50 h-auto"
              src={"/ZecPages_Banner.gif"}
              alt=""
              width={500}
              height={50}
              unoptimized={true}
            />
          </FadeInAnimation>
        </div>
      </div> */}
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
      <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-800 p-6 min-h-[250px] ">
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
          <p className="mb-5 text-slate-700 dark:text-slate-300 leading-relaxed">
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
                      ? "font-bold text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      : "text-blue-400 border border-blue-300 hover:bg-blue-800 hover:text-white dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-700 focus:ring-blue-300 dark:focus:ring-blue-800"
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
