"use client";
import Hero from "@/components/Hero/Hero";
import ContentSections from "@/components/Home/ContentSections";
import AnimationHome from "@/components/UI/AnimationHome";
import Cards from "@/components/UI/Cards";
import { cardsConfig } from "@/constants/cardsConfig";
import Link from "next/link";
import { FadeInAnimation } from "../UI/FadeInAnimation";

type HomeProps = {
  text: string;
};

const Home = ({ text }: HomeProps) => {
  return (
    <main className="flex flex-col mx-auto">
      <section id="hero">
        <FadeInAnimation>
          <Hero />
        </FadeInAnimation>
      </section>

      <section id="presentation" className="px-4 my-12">
        <FadeInAnimation className="flex flex-col items-center justify-center space-y-6 p-3 mt-6 shadow">
          <FadeInAnimation>
            <AnimationHome />
          </FadeInAnimation>
          <FadeInAnimation>
            <h1 className="text-4xl text-center font-bold mb-3">
              Welcome to ZecHub
            </h1>
          </FadeInAnimation>
          <div className="flex flex-col items-center justify-center m-auto">
            <FadeInAnimation>
              <p className="text-lg leading-relaxed text-center text-gray-700 dark:text-gray-400">
                {text}
              </p>
            </FadeInAnimation>
            <div className="w-full flex justify-center mt-12">
              <FadeInAnimation>
                <Link
                  type="button"
                  href="/explore"
                  className="transition duration-400 border-2 border-[#1984c7] font-bold rounded-md py-4 px-10 text-[#1984c7] bg-white hover:bg-[#1984c7] hover:text-white shadow-lg transform hover:scale-104"
                >
                  Explore Zcash
                </Link>
              </FadeInAnimation>
            </div>
          </div>
        </FadeInAnimation>
      </section>

      <section
        id="cardLinks"
        className="flex justify-center items-center px-4 my-12"
      >
        <div className="flex flex-col md:flex-row md:flex-wrap gap-8 justify-between items-stretch">
          {cardsConfig &&
            cardsConfig.map((items) => (
              <Cards
                key={items.title}
                paraph={items.content}
                title={items.title}
                url={items.url}
                image={items.image}
              />
            ))}
        </div>
      </section>

      <section id="content" className="px-4 my-12">
        <ContentSections />
      </section>
    </main>
  );
};

export default Home;
