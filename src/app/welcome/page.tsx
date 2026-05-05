"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; opacity: number; duration: number }[]
  >([]);

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 18 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.35 + 0.08,
        duration: Math.random() * 6 + 4,
      })),
    );
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden transition-colors duration-500 bg-[#e8f4fd] dark:bg-[#0a0f1e]">
      {/* ── Ambient background ────────────────────────────────── */}

      {/* Light-mode soft gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background:
            "linear-gradient(135deg, #e8f4fd 0%, #f4faff 50%, #ddf0fb 100%)",
        }}
      />
      {/* Dark-mode deep gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          background:
            "linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 50%, #0a1628 100%)",
        }}
      />

      {/* Orb 1 — top-left */}
      <div
        className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(25,132,199,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Orb 2 — bottom-right */}
      <div
        className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,230,200,0.09) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Grid lines — lighter in light mode */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(25,132,199,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(25,132,199,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(25,132,199,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(25,132,199,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating particles */}
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
              background: `rgba(25,132,199,${p.opacity})`,
              animation: `wlc-float ${p.duration}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

      {/* ── BANNER ────────────────────────────────────────────── */}
      <section
        className="relative z-10 w-full flex flex-col items-center justify-center text-center py-20 px-6"
        style={{ minHeight: "52vh" }}
      >
        {/* Banner image — slightly dimmed in light mode */}
        <img
          src="/welcome/zcash_prop_banner_TRANS_B.png"
          alt="Welcome to Zcash"
          className="max-w-full h-auto transition-all duration-500 dark:brightness-100 brightness-90 saturate-110"
        />

        {/* Eyebrow */}
        <div
          className="transition-colors duration-500 text-[#1984c7] dark:text-[#19b48c]"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginTop: "1.5rem",
            marginBottom: "1.75rem",
            opacity: 0,
            animation: mounted
              ? "wlc-rise .8s cubic-bezier(.22,1,.36,1) .15s forwards"
              : "none",
          }}
        >
          <span
            className="opacity-50 bg-[#1984c7] dark:bg-[#19b48c]"
            style={{ width: 28, height: 1 }}
          />
          Welcome to Zcash!
          <span
            className="opacity-50 bg-[#1984c7] dark:bg-[#19b48c]"
            style={{ width: 28, height: 1 }}
          />
        </div>

        {/* Main headline */}
        <h1
          className="transition-colors duration-500 text-[#071525] dark:text-white"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            marginBottom: "1.6rem",
            opacity: 0,
            animation: mounted
              ? "wlc-rise .9s cubic-bezier(.22,1,.36,1) .28s forwards"
              : "none",
          }}
        >
          Start your{" "}
          <em
            style={{
              fontStyle: "italic",
              background: "linear-gradient(105deg,#1984c7 0%,#19b48c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            journey
          </em>
          <br />
          learning.
        </h1>

        {/* Subtitle */}
        <p
          className="transition-colors duration-500 text-[rgba(7,21,37,0.58)] dark:text-[rgba(255,255,255,0.52)]"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "1.05rem",
            lineHeight: 1.8,
            fontWeight: 300,
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

        {/* CTAs */}
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
          <button
            onClick={() => router.push("/")}
            className="wlc-btn-primary group flex items-center gap-2 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_24px_rgba(25,132,199,0.45)]"
            style={{
              padding: "14px 28px",
              borderRadius: 9,
              background: "#1984c7",
              color: "#fff",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.01em",
              border: "none",
              cursor: "pointer",
            }}
          >
            Visit the Wiki
            <svg
              className="transition-transform duration-200 group-hover:translate-x-1"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="
              transition-all duration-200
              text-[rgba(7,21,37,0.55)] border-[rgba(7,21,37,0.18)]
              dark:text-[rgba(255,255,255,0.5)] dark:border-[rgba(255,255,255,0.15)]
              hover:text-[#071525] hover:border-[rgba(7,21,37,0.4)]
              dark:hover:text-white dark:hover:border-[rgba(255,255,255,0.35)]
            "
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 24px",
              borderRadius: 9,
              background: "transparent",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: "0.01em",
              cursor: "pointer",
              border: "1px solid",
            }}
          >
            Learn more
          </button> */}
        </div>
      </section>

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
      `}</style>
    </main>
  );
}
