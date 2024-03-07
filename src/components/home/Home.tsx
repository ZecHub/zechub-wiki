"use client";
import ContentSections from "@/components/ContentSections";
import Hero from "@/components/Hero";
import { NotificationBanner } from "@/components/Notification/NotificationBanner";
import AnimationHome from "@/components/ui/AnimationHome";
import Cards from "@/components/ui/Cards";
import { FadeInAnimation } from "@/components/ui/FadeInAnimation";
import { cardsConfig } from "@/constants/cardsConfig";
import Link from "next/link";

type HomeProps = {
  text: string;
};

const Home = ({ text }: HomeProps) => {
  return (
    <main className="flex flex-col mx-auto">
      <section id="notification-banner">
        <NotificationBanner />
      </section>
      <section id="hero">
        <FadeInAnimation>
          <Hero />
        </FadeInAnimation>
      </section>

      <div className="flex flex-col">
        <section id="presentation">
          <div className="w-full flex  items-center justify-center py-5">
            <FadeInAnimation>
              <div className="flex flex-col items-center justify-center p-3 mt-6 shadow">
                <FadeInAnimation>
                  <AnimationHome />
                </FadeInAnimation>
                <FadeInAnimation>
                  <h1 className="text-4xl text-center font-bold mb-3">Welcome to ZecHub</h1>
                </FadeInAnimation>
                <div className="flex items-center justify-center p-4 ">
                  <FadeInAnimation>
                    <p className="text-lg font-bold text-center">{text}</p>
                  </FadeInAnimation>
                </div>
                <div className="flex justify-center mx-auto">
                  <FadeInAnimation>
                    <Link
                      type="button"
                      href={"/explore"}
                      className=" md:hover:scale-110 border-[#1984c7] transition duration-400  border-4 font-bold rounded-full  py-4 px-8"
                    >
                      Explore Zcash
                    </Link>
                  </FadeInAnimation>
                </div>
              </div>
            </FadeInAnimation>
          </div>
        </section>

        <section id="cardLinks">
          <div className="p-5 flex flex-col space-y-7 md:flex-row md:space-x-11 items-center justify-center mb-4">
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

        <section id="content">
          <ContentSections />
        </section>
      </div>
    </main>
  );
};

export default Home;
