"use client";
import Image from "next/image";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

const Hero = () => {
  const { dark } = useDarkModeContext();
  const heroSrc = dark ? "/hero-dark.png" : "/hero-white.png";

  return (
    <div className="w-full mx-auto">
      <Image
        src={heroSrc}
        alt="ZecHub Hero"
        width={1920}     // ← change to your real width
        height={720}     // ← change to your real height
        className="w-full h-auto"
        priority
        unoptimized      // ← THIS IS THE MAGIC LINE
      />
    </div>
  );
};

export default Hero;