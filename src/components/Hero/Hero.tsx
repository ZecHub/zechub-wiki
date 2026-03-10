"use client";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

const Hero = () => {
  const { dark } = useDarkModeContext();
  const heroSrc = dark ? "/hero-dark.png" : "/hero-white.png";

  return (
    <div className="w-full mx-auto">
      <img
        src={heroSrc}
        alt="ZecHub Hero"
        className="w-full h-auto"
        loading="eager"
        style={{ imageRendering: "high-quality" }}
      />
    </div>
  );
};

export default Hero;