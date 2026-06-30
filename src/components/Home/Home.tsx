"use client";
import Hero from "@/components/Hero/Hero";
import ContentSections from "@/components/Home/ContentSections";
import AnimationHome from "@/components/UI/AnimationHome";
import Cards from "@/components/UI/Cards";
import { cardsConfig } from "@/constants/cardsConfig";
import Link from "next/link";
import Image from "next/image";
import Explorer from "../Explorer/Explorer";
import { FadeInAnimation } from "../UI/FadeInAnimation";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

type HomeProps = {
  text: string;
};

const HackathonBanner = ({ onDismiss }: { onDismiss: () => void }) => {
  const { t } = useLanguage();
  const hp = t?.pages?.hackathon?.popup;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-400 ${
          visible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hackathon-title"
        className={`fixed top-1/2 left-1/2 z-[9999] w-[min(560px,92vw)]
          bg-slate-50 dark:bg-slate-950 text-card-foreground
          border border-border
          rounded-2xl overflow-hidden shadow-xl
          transition-all duration-400
          ${
            visible
              ? "opacity-100 pointer-events-auto -translate-x-1/2 -translate-y-1/2 scale-100"
              : "opacity-0 pointer-events-none -translate-x-1/2 -translate-y-[48%] scale-95"
          }`}
      >
        {/* Animated top stripe */}
        <div className="h-1 bg-[var(--color-brand)] animate-shimmer bg-[length:200%_100%]" />

        <style>{`
          @keyframes hk-shimmer {
            0% { background-position: 0% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes hk-pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.5); }
          }
          .hk-shimmer {
            background: linear-gradient(90deg, var(--color-brand) 0%, #64dcc0 50%, var(--color-brand) 100%);
            background-size: 200% 100%;
            animation: hk-shimmer 2.5s linear infinite;
          }
          .hk-pulse { animation: hk-pulse-dot 1.4s ease-in-out infinite; }
        `}</style>

        {/* Replace the static stripe with the animated one */}
        <div className="h-1 hk-shimmer" />

        <div className="p-8">
          {/* Live badge */}
          <div className="inline-flex items-center gap-1.5 bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 rounded-full px-3 py-1 mb-5">
            <span className="hk-pulse w-2 h-2 rounded-full bg-[var(--color-brand)] inline-block" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-brand)]">
              {hp?.liveNow ?? "Live Now"}
            </span>
          </div>

          {/* Heading */}
          <h2
            id="hackathon-title"
            className="text-3xl font-extrabold leading-tight text-foreground mb-2"
          >
            ZecHub Hackathon{" "}
            <span className="text-[var(--color-brand)]">2026</span>
          </h2>

          {/* Subtitle */}
          <p className="text-base text-muted-foreground leading-relaxed mb-7">
            {hp?.subtitle ??
              "Build privacy-first applications on Zcash. Compete for prizes, earn ZEC, and shape the future of financial freedom."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { label: hp?.prizePool ?? "Prize Pool", value: "25 ZEC" },
              { label: hp?.start ?? "Start", value: "May 25" },
              { label: hp?.end ?? "End", value: "July 15" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-muted border border-border rounded-lg p-2.5 text-center"
              >
                <div className="text-[16px] imd:text-lg font-bold text-foreground">
                  {s.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <a
              href="/hackathon"
              onClick={handleDismiss}
              className="btn-brand flex-1 flex items-center justify-center rounded-lg font-bold text-[13px] imd:text-sm py-3 px-5 transition-colors"
            >
              {hp?.learnMore ?? "Learn More →"}
            </a>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-transparent border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 font-semibold text-[13px] imd:text-sm py-3 px-5 rounded-lg transition-colors cursor-pointer"
            >
              {hp?.dismiss ?? "Dismiss"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Home = ({ text }: HomeProps) => {
  const { t } = useLanguage();
  const [showHackathon, setShowHackathon] = useState(true);

  return (
    <main className="flex flex-col">
      {showHackathon && (
        <HackathonBanner onDismiss={() => setShowHackathon(false)} />
      )}

      <section id="hero" className="bg-slate-100 my-24">
        <FadeInAnimation>
          <Hero />
        </FadeInAnimation>
      </section>

      <div className="container mx-auto">
        <section
          id="presentation"
          className="px-1 bg-slate-100 dark:bg-transparent"
        >
          <FadeInAnimation className="flex flex-col items-center justify-center space-y-6 shadow">
            <FadeInAnimation className="mt-12">
              <AnimationHome />
            </FadeInAnimation>
            <FadeInAnimation>
              <h1 className="text-4xl text-center font-bold mb-3">
                {t.home?.heroTitle || "Welcome to ZecHub"}
              </h1>
            </FadeInAnimation>
            <div className="flex flex-col w-[90%] items-center justify-center m-auto">
              <FadeInAnimation>
                <p className="text-lg leading-relaxed text-center text-gray-700 dark:text-gray-400">
                  {text}
                </p>
              </FadeInAnimation>
              <div className="w-full flex justify-center my-12">
                <FadeInAnimation>
                  <Link
                    type="button"
                    href="#explore"
                    className="transition duration-400 border-2 border-[#1984c7] font-bold rounded-md py-4 px-10 text-white bg-[#1984c7] hover:bg-[#1574af] hover:text-white shadow-lg transform hover:scale-104"
                  >
                    {t.home?.exploreEcosystem || "Explore Zcash"}
                  </Link>
                </FadeInAnimation>
              </div>
            </div>
          </FadeInAnimation>
        </section>

        <section
          id="cardLinks"
          className="flex justify-center items-center px-4 my-24"
        >
          <div className="flex flex-col md:flex-row md:flex-wrap gap-8 justify-between items-stretch">
            {cardsConfig &&
              cardsConfig.map((items) => {
                const cardKey = items.title as
                  | "startHere"
                  | "pickWallet"
                  | "resources";
                const title = t.home?.cards?.[cardKey]?.title || items.title;
                const content =
                  t.home?.cards?.[cardKey]?.content || items.content;

                return (
                  <Cards
                    key={items.title}
                    paraph={content}
                    title={title}
                    url={items.url}
                    image={items.image}
                    imageLight={items.imageLight}
                    imageDark={items.imageDark}
                  />
                );
              })}
          </div>
        </section>

        <section id="content" className="px-4 my-24">
          <ContentSections />
        </section>

        <section id="explore" className="px-4 my-24 scroll-mt-24">
          <Explorer />
        </section>
      </div>
    </main>
  );
};

export default Home;
