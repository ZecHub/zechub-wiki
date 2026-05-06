"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../../../public/fonts/Gebuk_tf_ZEC.ttf",
  display: "swap",
});

export default function WelcomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [particles, setParticles] = useState<
    {
      x: number;
      y: number;
      size: number;
      opacity: number;
      duration: number;
    }[]
  >([]);
  const [scrolled, setScrolled] = useState(false);

  // ── 3. Floating particles drifting upward ───────────────────────────────
  const [risingParticles, setRisingParticles] = useState<
    {
      x: number;
      size: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    setParticles(
      Array.from({ length: 18 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.35 + 0.08,
        duration: Math.random() * 6 + 4,
      })),
    );

    // ── 3. Rising particles from bottom ──────────────────────────────────
    setRisingParticles(
      Array.from({ length: 18 }, () => ({
        x: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 8,
      })),
    );

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const t = {
    pageBg: isDark
      ? "linear-gradient(135deg, #000000 0%, #0d0d0d 50%, #000000 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)",
    orb1: isDark
      ? "radial-gradient(circle, rgba(244,183,40,0.13) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(244,183,40,0.22) 0%, transparent 70%)",
    orb2: isDark
      ? "radial-gradient(circle, rgba(244,183,40,0.08) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(244,183,40,0.14) 0%, transparent 70%)",
    grid: isDark
      ? "linear-gradient(rgba(244,183,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,183,40,0.04) 1px, transparent 1px)"
      : "linear-gradient(rgba(180,130,0,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(180,130,0,0.09) 1px, transparent 1px)",
    particle: (opacity: number) =>
      isDark
        ? `rgba(244,183,40,${opacity})`
        : `rgba(180,130,0,${opacity * 0.65})`,
    eyebrow: isDark ? "#F4B728" : "#b38200",
    headline: isDark ? "#FFFFFF" : "#0a0a0a",
    subtitle: isDark ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.48)",
    imgFilter: isDark
      ? "brightness(1) saturate(1.05)"
      : "brightness(0.95) saturate(1.1)",
    btnBg: "#F4B728",
    btnBgHover: isDark ? "#ffe082" : "#d4a000",
    btnText: "#000000",
    btnGlow: isDark
      ? "0 0 28px rgba(244,183,40,0.5)"
      : "0 0 20px rgba(244,183,40,0.45)",
    toggleBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    toggleBgHover: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)",
    toggleBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
    toggleText: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.55)",
    glowBg: isDark
      ? "radial-gradient(circle, rgba(244,183,40,0.12) 0%, transparent 68%)"
      : "radial-gradient(circle, rgba(180,130,0,0.18) 0%, transparent 68%)",
    ringBorder: isDark
      ? "1px solid rgba(244,183,40,0.15)"
      : "1px solid rgba(180,130,0,0.3)",
    risingParticleBg: isDark ? "rgba(244,183,40,0.5)" : "rgba(180,130,0,0.35)",
  } as const;

  return (
    <main
      className="relative min-h-screen flex flex-col items-center overflow-hidden transition-colors duration-500"
      style={{ background: isDark ? "#000000" : "#ffffff" }}
    >
      {/* ── Ambient background ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{ background: t.pageBg }}
      />
      <div
        className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-500"
        style={{ background: t.orb1, filter: "blur(40px)" }}
      />
      <div
        className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none transition-all duration-500"
        style={{ background: t.orb2, filter: "blur(50px)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          backgroundImage: t.grid,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── 1. Breathing gold glow behind hero ─────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "50%",
          marginLeft: -350,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: t.glowBg,
          animation: "wlc-breathe 6s ease-in-out infinite",
        }}
      />

      {/* ── 2. Expanding rings (blockchain ripple) ──────────────── */}
      {[0, 1.3, 2.6].map((delay, i) => (
        <div
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            top: "30%",
            left: "50%",
            width: 400,
            height: 400,
            marginLeft: -200,
            marginTop: -200,
            border: t.ringBorder,
            opacity: 0,
            animation: `wlc-ring-expand 4s ease-out ${delay}s infinite`,
          }}
        />
      ))}

      {/* ── 3. Rising particles from bottom ────────────────────── */}
      {mounted &&
        risingParticles.map((p, i) => (
          <span
            key={`r-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              bottom: "0%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: t.risingParticleBg,
              animation: `wlc-rise-up ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

      {/* ── existing floating particles ────────────────────────── */}
      {mounted &&
        particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: t.particle(p.opacity),
              animation: `wlc-float ${p.duration}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

      {/* ════════════════════════════════════════════
            NAV
        ════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          borderBottom: `1px solid ${scrolled ? "var(--wlc-border)" : "transparent"}`,
          background: scrolled
            ? "color-mix(in srgb, var(--wlc-bg) 88%, transparent)"
            : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          transition: "all .35s ease",
        }}
        className="flex-row-reverse px-4 imd:px-12"
      >
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 6,
              background: t.toggleBg,
              border: `0.5px solid ${t.toggleBorder}`,
              color: t.toggleText,
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                t.toggleBgHover)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                t.toggleBg)
            }
            className="p-1"
          >
            {isDark ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
              </svg>
            )}
          </button>
        )}
      </nav>

      {/* ── Announcement Ticker ──────────────────────────────────── */}
      <div
        className="relative imd:fixed"
        style={{
          top: 64,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: "9px 0",
          overflow: "hidden",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "ticker-scroll 28s linear infinite",
            willChange: "transform",
          }}
        >
          {Array.from({ length: 6 })
            .concat(Array.from({ length: 6 }))
            .map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "#F4B728",
                  paddingRight: "6rem",
                  whiteSpace: "nowrap",
                }}
              >
                This is the new landing page for{" "}
                <a
                  href="https://z.cash"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                    textDecoration: "none",
                    borderBottom: `1px solid ${
                      isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"
                    }`,
                    paddingBottom: 1,
                  }}
                >
                  z.cash
                </a>
              </span>
            ))}
        </div>
      </div>

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section
        className="relative z-10 w-full flex flex-col items-center justify-center text-center py-20 px-0"
        style={{ minHeight: "52vh" }}
      >
        <div>
          <img
            src="/welcome/zcash_prop_banner_TRANS_B.png"
            alt="Welcome to Zcash"
            className="block dark:hidden max-w-full h-auto transition-all duration-500"
            style={{ filter: t.imgFilter }}
          />
          <img
            src="/welcome/zcash_prop_banner_copy.png"
            alt="Welcome to Zcash"
            className="hidden dark:block max-w-full h-auto transition-all duration-500"
            style={{ filter: t.imgFilter }}
          />
        </div>
        <div className="my-4 flex flex-col items-center justify-center">
          <h1
            className="transition-colors duration-500"
            style={{
              fontFamily: myFont.style.fontFamily,
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: t.headline,
              marginBottom: "1.6rem",
              opacity: 0,
              animation: mounted
                ? "wlc-rise .9s cubic-bezier(.22,1,.36,1) .28s forwards"
                : "none",
            }}
          >
            Start your{" "}
            {/* ── 4. Gold shimmer on "journey" ─────────────────── */}
            <em
              style={{
                fontStyle: "italic",
                background:
                  "linear-gradient(105deg, #F4B728 0%, #ffe082 40%, #F4B728 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "wlc-shimmer 3.5s ease-in-out infinite",
              }}
            >
              journey
            </em>
            <br />
            learning.
          </h1>

          <p
            className="transition-colors duration-500 px-5"
            style={{
              fontFamily: "serif",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              fontWeight: 300,
              color: t.subtitle,
              maxWidth: 520,
              marginBottom: "2.8rem",
              opacity: 0,
              animation: mounted
                ? "wlc-rise .9s cubic-bezier(.22,1,.36,1) .42s forwards"
                : "none",
            }}
          >
            Here you can find guides, resources, community updates, tools, and
            helpful links for getting involved.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              opacity: 0,
              animation: mounted
                ? "wlc-rise .9s cubic-bezier(.22,1,.36,1) .56s forwards"
                : "none",
            }}
          >
            {/* ── 5. Button sheen ──────────────────────────────── */}
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "14px 28px",
                borderRadius: 9,
                background: t.btnBg,
                color: t.btnText,
                fontFamily: myFont.style.fontFamily,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.01em",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.transform = "translateY(-1px)";
                btn.style.boxShadow = t.btnGlow;
                btn.style.background = t.btnBgHover;
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.transform = "translateY(0)";
                btn.style.boxShadow = "none";
                btn.style.background = t.btnBg;
              }}
            >
              {/* sheen overlay */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                  animation: "wlc-sheen 3s ease-in-out 1.5s infinite",
                  pointerEvents: "none",
                }}
              />
              Visit the Wiki
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                style={{ transition: "transform 0.2s", position: "relative" }}
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="#000000"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════ */}
      <footer
        className="flex items-center justify-center imd:justify-between"
        style={{
          marginTop: "auto",
          position: "relative",
          zIndex: 5,
          width: "100%",
          borderTop: "1px solid var(--wlc-border)",
          padding: "1.75rem 3rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--wlc-&&)",
            fontSize: 11,
            color: "var(--wlc-subtle)",
            letterSpacing: "0.04em",
          }}
        >
          © {new Date().getFullYear()} ZecHub · Built by the community
        </span>
      </footer>

      <style>{`
        @keyframes wlc-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wlc-rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wlc-float {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-18px) scale(1.3); }
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* 1. Breathing gold glow */
        @keyframes wlc-breathe {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.14); }
        }

        /* 2. Expanding rings — scale up from center, no translate needed */
        @keyframes wlc-ring-expand {
          0%   { opacity: 0.5; transform: scale(0.2); }
          100% { opacity: 0;   transform: scale(3); }
        }

        /* 3. Rising particles */
        @keyframes wlc-rise-up {
          0%   { transform: translateY(0)      scale(1);   opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.1; }
          100% { transform: translateY(-80vh)  scale(0.3); opacity: 0; }
        }

        /* 4. Gold shimmer — animates background-position */
        @keyframes wlc-shimmer {
          0%        { background-position: 0%   50%; }
          50%       { background-position: 100% 50%; }
          100%      { background-position: 0%   50%; }
        }

        /* 5. Button sheen */
        @keyframes wlc-sheen {
          0%        { transform: translateX(-100%); }
          30%, 100% { transform: translateX(150%); }
        }
      `}</style>
    </main>
  );
}
