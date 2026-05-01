"use client";
// src/components/ZipSimulator/ZipSimulator.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZIPS,
  BASE_STATS,
  CAT_STYLES,
  STATUS_STYLES,
  NETWORK_STATS,
  type ZIPData,
  type SliderConfig,
  type MetricResult,
  type BaseNetworkStats,
} from "@/lib/zipSimulatorData";

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES (fonts + range input + scrollbar — cannot be done in Tailwind)
// ═══════════════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

  .zip-sim input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
  }
  .zip-sim input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px; border-radius: 50%;
    background: #67d3e0; cursor: pointer;
    border: 2.5px solid #0a1019;
    box-shadow: 0 0 12px rgba(103,211,224,0.5);
    transition: box-shadow 0.2s;
  }
  .zip-sim input[type="range"]::-webkit-slider-thumb:hover {
    box-shadow: 0 0 22px rgba(103,211,224,0.8);
  }
  .zip-sim input[type="range"]::-moz-range-thumb {
    width: 18px; height: 18px; border-radius: 50%;
    background: #67d3e0; border: 2.5px solid #0a1019; cursor: pointer;
  }
  .zip-sim ::-webkit-scrollbar { width: 4px; }
  .zip-sim ::-webkit-scrollbar-thumb { background: rgba(103,211,224,0.15); border-radius: 2px; }

  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(103,211,224,0.06); }
    50%      { box-shadow: 0 0 40px rgba(103,211,224,0.14); }
  }
  .dark .slider-panel-glow { animation: glowPulse 7s ease-in-out infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.35; }
  }
  .pulse-dot { animation: pulse 2s infinite; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-5px); }
  }
  .float-icon { animation: float 5s ease-in-out infinite; }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// DARK MODE DETECTION (for canvas only)
// ═══════════════════════════════════════════════════════════════════════════════
function useIsDark() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE AREA CHART (Canvas) — hover crosshair + value tooltip
// ═══════════════════════════════════════════════════════════════════════════════
function AreaChart({
  data,
  color,
  height = 110,
  baseline,
  format,
}: {
  data: number[];
  color: string;
  height?: number;
  baseline?: number;
  format: (v: number) => string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hoverRef = useRef<number | null>(null);
  const isDark = useIsDark();
  const progressRef = useRef(0);

  const drawChart = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
    const ease = progressRef.current;
    const hoverX = hoverRef.current;

    const gridColor = isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.06)";
    const baselineStroke = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";
    const baselineLabel = isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)";
    const monthLabel = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.22)";
    const hoverLine = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
    const tooltipBg = isDark ? "#0c1422" : "#ffffff";
    const tooltipBorder = isDark ? "rgba(103,211,224,0.3)" : "rgba(0,0,0,0.12)";
    const tooltipText = isDark ? "#e0e0e0" : "#333333";

    ctx.clearRect(0, 0, W, H);

    // Scale
    const allVals = baseline !== undefined ? [...data, baseline] : data;
    const mn = Math.min(...allVals);
    const mx = Math.max(...allVals);
    const rng = mx - mn || 1;
    const pad = { t: 8, b: 20, l: 6, r: 6 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    const pts = data.map((v, i) => ({
      x: pad.l + (i / (data.length - 1)) * cW,
      y: pad.t + cH - ((v - mn) / rng) * cH * ease,
    }));

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = pad.t + (cH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(W - pad.r, y);
      ctx.stroke();
    }

    // Baseline
    if (baseline !== undefined) {
      const baselineY = pad.t + cH - ((baseline - mn) / rng) * cH;
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = baselineStroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pad.l, baselineY);
      ctx.lineTo(W - pad.r, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = baselineLabel;
      ctx.font = "500 8px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("current", pad.l + 4, baselineY - 5);
      ctx.restore();
    }

    // Area fill
    const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    grad.addColorStop(0, color + "30");
    grad.addColorStop(0.7, color + "0a");
    grad.addColorStop(1, color + "02");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H - pad.b);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H - pad.b);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Data point dots (small)
    pts.forEach((p, i) => {
      if (i % 3 === 0 || i === 12) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });

    // Endpoint glow
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color + "18";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Month labels
    ctx.fillStyle = monthLabel;
    ctx.font = "500 9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    [0, 3, 6, 9, 12].forEach((m) => {
      const x = pad.l + (m / 12) * cW;
      ctx.fillText(`M${m}`, x, H - 3);
    });

    // ── Hover crosshair + tooltip ──
    if (hoverX !== null && hoverX >= pad.l && hoverX <= W - pad.r) {
      const t = (hoverX - pad.l) / cW;
      const idx = Math.min(12, Math.max(0, Math.round(t * 12)));
      const pt = pts[idx];
      const val = data[idx];

      // Vertical line
      ctx.strokeStyle = hoverLine;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pt.x, pad.t);
      ctx.lineTo(pt.x, H - pad.b);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color + "30";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isDark ? "#0c1422" : "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tooltip box
      const label = `M${idx}: ${format(val)}`;
      ctx.font = "600 10px 'JetBrains Mono', monospace";
      const tw = ctx.measureText(label).width + 14;
      const th = 22;
      let tx = pt.x - tw / 2;
      const ty = pt.y - th - 10;
      if (tx < 2) tx = 2;
      if (tx + tw > W - 2) tx = W - tw - 2;

      ctx.fillStyle = tooltipBg;
      ctx.strokeStyle = tooltipBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tx, Math.max(2, ty), tw, th, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = tooltipText;
      ctx.textAlign = "center";
      ctx.fillText(label, tx + tw / 2, Math.max(2, ty) + 15);
    }
  }, [data, color, baseline, isDark, format]);

  // Animate in
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 700;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      progressRef.current = Math.min(1, (now - startTime) / duration);
      progressRef.current = 1 - Math.pow(1 - progressRef.current, 3);
      drawChart();
      if (progressRef.current < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    progressRef.current = 0;
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [data, color, baseline, isDark, drawChart]);

  // Redraw on hover without re-animating
  useEffect(() => {
    if (progressRef.current >= 1) drawChart();
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    hoverRef.current = e.clientX - rect.left;
    if (progressRef.current >= 1) drawChart();
  };

  const handleMouseLeave = () => {
    hoverRef.current = null;
    if (progressRef.current >= 1) drawChart();
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full block rounded-md cursor-crosshair"
      style={{ height: `${height}px` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════════
function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
        role="button"
        aria-label="More info"
        className="w-4 h-4 rounded-full text-[9px] inline-flex items-center justify-center cursor-help transition-colors duration-150 bg-[rgba(103,211,224,0.1)] text-[#67d3e0] border border-[rgba(103,211,224,0.18)]"
      >
        ?
      </span>
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-[calc(100%+8px)] top-[-4px] w-[230px] rounded-[10px] px-[11px] py-2 text-[11px] leading-[1.55] z-[100] pointer-events-none bg-white dark:bg-[#090e1a] border border-zinc-200 dark:border-[rgba(103,211,224,0.22)] text-zinc-500 dark:text-white/[0.58] shadow-[0_10px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.55)]"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARAMETER SLIDER
// ═══════════════════════════════════════════════════════════════════════════════
function ParamSlider({ cfg, val, onChange }: { cfg: SliderConfig; val: number; onChange: (id: string, v: number) => void }) {
  const pct = ((val - cfg.min) / (cfg.max - cfg.min)) * 100;
  return (
    <div className="mb-[22px]">
      <div className="flex justify-between items-center mb-[7px]">
        <span className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-zinc-500 dark:text-white/[0.62]">{cfg.label}</span>
          <Tip text={cfg.tooltip} />
        </span>
        <span className="font-mono text-[13px] font-bold text-[#67d3e0]">
          {val.toLocaleString()} <span className="text-[9px] opacity-50">{cfg.unit}</span>
        </span>
      </div>
      <input
        type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={val}
        onChange={(e) => onChange(cfg.id, Number(e.target.value))}
        className="w-full h-[5px] rounded-[3px] outline-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #67d3e0 ${pct}%, rgba(255,255,255,0.07) ${pct}%)` }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[9px] font-mono text-zinc-400 dark:text-white/[0.18]">{cfg.min.toLocaleString()}</span>
        <span className="text-[9px] font-mono text-zinc-400 dark:text-white/[0.18]">{cfg.max.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// METRIC CARD
// ═══════════════════════════════════════════════════════════════════════════════
function MetricCard({ m, vals, index }: { m: MetricResult; vals: Record<string, number>; index: number }) {
  const data = m.compute(vals, BASE_STATS);
  const baselineVal = m.baseline(vals, BASE_STATS);
  const cur = data[0];
  const proj = data[12];
  const pct = cur !== 0 ? ((proj - cur) / Math.abs(cur)) * 100 : proj > 0 ? 100 : 0;
  const up = proj >= cur;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="rounded-2xl p-4 px-[18px] transition-all duration-300 cursor-default bg-white dark:bg-white/[0.022] border border-zinc-200/80 dark:border-white/[0.06] shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)]"
    >
      <p className="text-[10px] mb-[3px] leading-[1.45] text-zinc-400 dark:text-white/[0.32]">{m.description}</p>
      <h4 className="m-0 mb-3.5 text-sm font-bold text-zinc-800 dark:text-white/[0.88]">{m.label}</h4>

      <AreaChart data={data} color={m.color} height={110} baseline={baselineVal} format={m.format} />

      <div className="flex justify-between mt-3 items-end">
        <div>
          <div className="text-[9px] font-mono mb-[3px] text-zinc-400 dark:text-white/[0.22]">NOW</div>
          <div className="text-[15px] font-extrabold font-mono text-zinc-500 dark:text-white/[0.58]">{m.format(cur)}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono mb-[3px] text-zinc-400 dark:text-white/[0.22]">12 MONTHS</div>
          <div className="text-[15px] font-extrabold font-mono" style={{ color: m.color }}>{m.format(proj)}</div>
        </div>
      </div>

      <div className={`mt-3 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${up ? "bg-[rgba(82,183,136,0.08)]" : "bg-[rgba(230,57,70,0.07)]"}`}>
        <span className="text-[13px]">{up ? "↑" : "↓"}</span>
        <span className="text-[11px] font-mono" style={{ color: up ? "#52b788" : "#e63946" }}>
          {Math.abs(pct).toFixed(1)}% projected change
        </span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZIP SELECTION CARD
// ═══════════════════════════════════════════════════════════════════════════════
function ZipCard({ zip, onClick, index }: { zip: ZIPData; onClick: () => void; index: number }) {
  const cat = CAT_STYLES[zip.category];
  const sta = STATUS_STYLES[zip.status];
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="block w-full text-left cursor-pointer rounded-2xl p-5 px-[18px] transition-all duration-[280ms] font-[inherit] group bg-white dark:bg-white/[0.018] border border-zinc-200/80 dark:border-white/[0.055] text-zinc-800 dark:text-white shadow-sm dark:shadow-none hover:bg-zinc-50 dark:hover:bg-[rgba(103,211,224,0.055)] hover:border-zinc-300 dark:hover:border-[rgba(103,211,224,0.28)] hover:shadow-lg dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl w-[42px] h-[42px] rounded-xl flex items-center justify-center flex-shrink-0 bg-zinc-50 dark:bg-white/[0.03]">{zip.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] font-bold tracking-[0.1em] mb-[3px] text-[#67d3e0]">{zip.number}</div>
          <div className="text-sm font-bold leading-tight text-zinc-800 dark:text-white/90">{zip.title}</div>
        </div>
      </div>
      <div className="flex gap-1.5 mb-2.5 flex-wrap">
        <span className="px-[9px] py-[3px] rounded-md text-[9px] font-bold tracking-[0.05em]" style={{ background: cat.bg, color: cat.color }}>{cat.label.toUpperCase()}</span>
        <span className="px-[9px] py-[3px] rounded-md text-[9px] flex items-center gap-1" style={{ background: sta.bg, color: sta.color }}>
          {sta.pulse && <span className="w-[5px] h-[5px] rounded-full inline-block pulse-dot" style={{ background: sta.color }} />}
          {zip.status}
        </span>
      </div>
      <p className="m-0 text-xs leading-[1.65] text-zinc-500 dark:text-white/40">{zip.shortDesc}</p>
      <div className="mt-3.5 text-xs font-semibold flex items-center gap-1.5 text-[#67d3e0]">
        Open Simulator <span className="transition-transform duration-200 inline-block group-hover:translate-x-[5px]">→</span>
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NETWORK STATS BAR
// ═══════════════════════════════════════════════════════════════════════════════
function NetworkStatsBar() {
  return (
    <div className="zip-sim-stats-bar flex gap-2 flex-wrap mt-[18px]">
      {NETWORK_STATS.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
          className="zip-sim-stats-item py-[9px] px-3.5 rounded-[10px] bg-white dark:bg-white/[0.02] border border-zinc-200/80 dark:border-white/[0.045] shadow-sm dark:shadow-none"
        >
          <div className="text-[9px] font-mono text-zinc-400 dark:text-white/[0.22]">{s.label}</div>
          <div className="text-sm font-extrabold font-mono text-[#67d3e0]">{s.value}</div>
          <div className="text-[9px] font-mono text-zinc-400 dark:text-white/[0.18]">{s.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ZipSimulator() {
  const [selected, setSelected] = useState<ZIPData | null>(null);
  const [vals, setVals] = useState<Record<string, number>>({});
  const [catFilter, setCatFilter] = useState("all");
  const [showIntro, setShowIntro] = useState(true);

  const selectedRef = useRef<ZIPData | null>(null);
  selectedRef.current = selected;

  const handleSelect = useCallback((zip: ZIPData) => {
    setSelected(zip);
    setVals({ ...zip.defaultValues });
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 60);
  }, []);

  const handleReset = useCallback(() => {
    const zip = selectedRef.current;
    if (!zip) return;
    setVals({ ...zip.defaultValues });
  }, []);

  const handleChange = useCallback((id: string, v: number) => {
    setVals((p) => ({ ...p, [id]: v }));
  }, []);

  const filtered = catFilter === "all" ? ZIPS : ZIPS.filter((z) => z.category === catFilter);
  const allCategories = ["all", ...Object.keys(CAT_STYLES)];

  return (
    <div
      className="zip-sim min-h-screen pb-20 font-['Sora','DM_Sans',system-ui,sans-serif] text-zinc-800 dark:text-white bg-zinc-50 dark:bg-[#060810]"
      style={{ backgroundImage: "radial-gradient(ellipse at 15% 0%, rgba(103,211,224,0.04) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(106,76,147,0.025) 0%, transparent 50%)" }}
    >
      <style>{GLOBAL_CSS}</style>

      {/* ══ HEADER ══ */}
      <header className="border-b border-zinc-200/60 dark:border-[rgba(103,211,224,0.07)] bg-white/60 dark:bg-[rgba(103,211,224,0.015)] backdrop-blur-sm dark:backdrop-blur-none">
        <div className="max-w-[1200px] mx-auto px-5 py-4">
          <AnimatePresence>
            {selected && (
              <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                onClick={() => setSelected(null)}
                className="mb-3 py-[7px] px-4 rounded-lg text-xs cursor-pointer font-semibold font-[inherit] transition-all duration-200 text-[#67d3e0] border border-[rgba(103,211,224,0.18)] bg-[rgba(103,211,224,0.06)] hover:bg-[rgba(103,211,224,0.12)]"
              >
                ← All ZIPs
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-3.5">
            <div className="float-icon w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-[23px] flex-shrink-0 bg-gradient-to-br from-[#67d3e0] to-[#457b9d]">⚡</div>
            <div className="flex-1">
              <h1 className="text-[clamp(20px,4vw,32px)] font-extrabold leading-[1.05] m-0 bg-gradient-to-r from-zinc-800 via-[#67d3e0] to-[#6a4c93] dark:from-white dark:via-[#67d3e0] dark:to-[#6a4c93] bg-clip-text text-transparent">ZIPs Simulator</h1>
              <p className="text-xs mt-1 m-0 text-zinc-400 dark:text-white/[0.32]">Explore Zcash Improvement Proposals — see real-world impact before they ship</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5">
        {/* ══ SELECTION VIEW ══ */}
        <AnimatePresence mode="wait">
          {!selected && (
            <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <AnimatePresence>
                {showIntro && (
                  <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginTop: 0, padding: 0, overflow: "hidden" }} transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mt-5 rounded-2xl p-[18px] px-[22px] relative border border-zinc-200 dark:border-[rgba(103,211,224,0.14)] bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-[rgba(103,211,224,0.04)] dark:to-[rgba(69,123,157,0.04)]"
                  >
                    <button onClick={() => setShowIntro(false)} className="absolute top-2.5 right-3.5 bg-transparent border-none cursor-pointer text-lg leading-none text-zinc-400 dark:text-white/[0.28] hover:text-zinc-600 dark:hover:text-white/50">×</button>
                    <div className="text-xs font-bold mb-1.5 text-[#67d3e0]">How it works</div>
                    <p className="text-[13px] leading-[1.85] text-zinc-500 dark:text-white/[0.48]">
                      Pick a ZIP below. Each simulator starts with <strong className="text-zinc-700 dark:text-white/[0.78]">real mainnet data</strong>, then lets you drag sliders to model adoption scenarios. <strong className="text-zinc-700 dark:text-white/[0.78]">Hover over charts</strong> to see exact values at each month. The dashed line shows the current network baseline. <strong className="text-zinc-700 dark:text-white/[0.78]">10 ZIPs</strong> covering fees, privacy, assets, sustainability, protocol &amp; governance.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <NetworkStatsBar />
              <div className="zip-sim-cat-filters mt-4 flex gap-2 flex-wrap">
                {allCategories.map((id) => {
                  const active = catFilter === id;
                  return (
                    <motion.button key={id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setCatFilter(id)}
                      className={`py-1.5 px-[15px] rounded-full text-[11px] font-semibold cursor-pointer font-[inherit] transition-all duration-200 ${active ? "border border-[rgba(103,211,224,0.4)] bg-[rgba(103,211,224,0.1)] text-[#67d3e0]" : "border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] text-zinc-400 dark:text-white/[0.38]"}`}
                    >
                      {id === "all" ? "All ZIPs" : CAT_STYLES[id]?.label}
                    </motion.button>
                  );
                })}
              </div>
              <div className="zip-cards-grid mt-[18px] grid grid-cols-3 gap-3 max-[1100px]:grid-cols-2 max-[860px]:grid-cols-2 max-[600px]:grid-cols-1">
                {filtered.map((zip, i) => <ZipCard key={zip.id} zip={zip} onClick={() => handleSelect(zip)} index={i} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ SIMULATOR VIEW ══ */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div key="simulator" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: "easeOut" }} className="pt-[22px]">
              <div className="mb-7">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <span className="text-[30px]">{selected.icon}</span>
                  <span className="font-mono text-[11px] font-bold tracking-[0.1em] py-[5px] px-3 rounded-[7px] text-[#67d3e0] bg-[rgba(103,211,224,0.07)]">{selected.number}</span>
                  <span className="py-[5px] px-3 rounded-[7px] text-[10px] font-bold" style={{ background: CAT_STYLES[selected.category].bg, color: CAT_STYLES[selected.category].color }}>{CAT_STYLES[selected.category].label.toUpperCase()}</span>
                  <span className="py-[5px] px-3 rounded-[7px] text-[10px] flex items-center gap-[5px]" style={{ background: STATUS_STYLES[selected.status].bg, color: STATUS_STYLES[selected.status].color }}>
                    {STATUS_STYLES[selected.status].pulse && <span className="w-[5px] h-[5px] rounded-full inline-block pulse-dot" style={{ background: STATUS_STYLES[selected.status].color }} />}
                    {selected.status}
                  </span>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleReset}
                    className="ml-auto rounded-lg py-1.5 px-4 text-[11px] cursor-pointer font-[inherit] font-semibold transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap bg-[rgba(103,211,224,0.07)] border border-[rgba(103,211,224,0.18)] text-[#67d3e0] hover:bg-[rgba(103,211,224,0.14)]"
                    title="Reset all sliders to default values"
                  >↺ Reset to defaults</motion.button>
                </div>
                <h2 className="text-[clamp(22px,4vw,36px)] font-extrabold m-0 mb-3.5 leading-[1.12] text-zinc-800 dark:text-white">{selected.title}</h2>
                <p className="text-sm leading-[1.8] max-w-[720px] m-0 mb-5 text-zinc-500 dark:text-white/50">{selected.plainEnglish}</p>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                  className="rounded-[14px] p-4 px-5 mb-3.5 border border-zinc-200 dark:border-[rgba(103,211,224,0.09)] bg-zinc-50 dark:bg-[rgba(103,211,224,0.025)]"
                >
                  <div className="text-[10px] font-bold tracking-[0.12em] mb-2.5 text-[#67d3e0]">KEY CHANGES</div>
                  <div className="flex flex-col gap-2">
                    {selected.keyChanges.map((c, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-[11px] mt-0.5 flex-shrink-0 text-[#67d3e0]">→</span>
                        <span className="text-xs leading-[1.55] text-zinc-500 dark:text-white/[0.52]">{c}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <a href={selected.learnMoreUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#67d3e0] no-underline hover:underline">Read full specification ↗</a>
              </div>

              {/* 2-Column Layout */}
              <div className="zip-sim-layout grid grid-cols-[minmax(260px,310px)_1fr] gap-6 items-start max-[860px]:grid-cols-1 max-[600px]:grid-cols-1">
                {/* Sliders */}
                <div>
                  <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
                    className="slider-panel-glow rounded-2xl p-5 sticky top-4 border border-zinc-200/80 dark:border-white/[0.05] bg-white dark:bg-white/[0.018] shadow-sm dark:shadow-none"
                  >
                    <div className="flex justify-between items-center mb-[22px]">
                      <span className="text-[10px] font-bold tracking-[0.12em] text-zinc-400 dark:text-white/[0.32]">PARAMETERS</span>
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={handleReset}
                        className="rounded-md py-1 px-3 text-[10px] cursor-pointer font-[inherit] transition-colors duration-150 bg-[rgba(103,211,224,0.07)] border border-[rgba(103,211,224,0.16)] text-[#67d3e0] hover:bg-[rgba(103,211,224,0.14)]"
                      >Reset</motion.button>
                    </div>
                    {selected.sliders.map((s) => (
                      <ParamSlider key={s.id} cfg={s} val={vals[s.id] ?? s.defaultValue} onChange={handleChange} />
                    ))}
                    <div className="mt-3.5 py-2.5 px-3 rounded-lg bg-zinc-50 dark:bg-[rgba(103,211,224,0.025)]">
                      <p className="text-[10px] leading-[1.65] m-0 text-zinc-400 dark:text-white/[0.28]">
                        Charts update live as you drag. <strong className="text-zinc-500 dark:text-white/[0.4]">Hover over any chart</strong> to see exact values at each month. The dashed line marks the current network baseline.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Charts */}
                <div>
                  <div className="text-[10px] font-bold tracking-[0.12em] mb-3.5 text-zinc-400 dark:text-white/[0.28]">PROJECTED IMPACT — 12 MONTH SIMULATION</div>
                  <div className="zip-sim-metrics-grid grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 max-[600px]:grid-cols-1">
                    {selected.metrics.map((m, i) => <MetricCard key={m.id} m={m} vals={vals} index={i} />)}
                  </div>

                  {/* Before vs After */}
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-[22px] rounded-2xl p-5 border border-zinc-200/80 dark:border-white/[0.05] bg-white dark:bg-white/[0.015] shadow-sm dark:shadow-none"
                  >
                    <div className="text-[10px] font-bold tracking-[0.12em] mb-4 text-zinc-400 dark:text-white/[0.28]">BEFORE vs AFTER SNAPSHOT</div>
                    <div className="zip-sim-ba-grid grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5 max-[600px]:grid-cols-1">
                      {selected.metrics.map((m) => {
                        const data = m.compute(vals, BASE_STATS);
                        return (
                          <motion.div key={m.id} className="group" whileHover={{ scale: 1.01 }}>
                            <div className="text-[11px] mb-2 text-zinc-400 dark:text-white/[0.32]">{m.label}</div>
                            <div className="flex gap-2.5 items-center">
                              <div className="flex-1 rounded-[10px] py-2.5 px-[13px] bg-zinc-50 dark:bg-white/[0.025]">
                                <div className="text-[9px] font-mono mb-[3px] text-zinc-400 dark:text-white/[0.2]">BEFORE</div>
                                <div className="font-mono text-sm font-bold text-zinc-500 dark:text-white/[0.52]">{m.format(data[0])}</div>
                                <div className="text-[9px] font-mono mt-0.5 text-zinc-400 dark:text-white/[0.18]">{m.beforeLabel}</div>
                              </div>
                              <span className="flex-shrink-0 text-base transition-transform duration-200 text-[#67d3e0] group-hover:scale-[1.3]">→</span>
                              <div className="flex-1 rounded-[10px] py-2.5 px-[13px]" style={{ background: `${m.color}08`, border: `1px solid ${m.color}1a` }}>
                                <div className="text-[9px] font-mono mb-[3px] text-zinc-400 dark:text-white/[0.2]">AFTER</div>
                                <div className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.format(data[12])}</div>
                                <div className="text-[9px] font-mono mt-0.5 text-zinc-400 dark:text-white/[0.18]">{m.afterLabel}</div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Disclaimer */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-6 py-3 px-4 rounded-[10px] flex gap-2.5 items-start border border-zinc-200/60 dark:border-white/[0.04] bg-zinc-50/50 dark:bg-white/[0.01]"
                  >
                    <span className="text-sm flex-shrink-0 opacity-45">⚠️</span>
                    <p className="text-[10px] leading-[1.7] m-0 text-zinc-400 dark:text-white/[0.22]">
                      <strong className="text-zinc-500 dark:text-white/[0.32]">Disclaimer:</strong> Projections are illustrative models based on simplified assumptions — not financial advice. All figures are estimates derived from ZIP specifications and real mainnet baselines. Do not make investment or protocol decisions based solely on these simulations.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}