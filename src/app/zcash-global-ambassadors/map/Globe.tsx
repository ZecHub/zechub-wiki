"use client";

import createGlobe from "cobe";
import { Minus, Plus } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import {
  BASE_COLOR,
  REGION_COLORS,
  REGION_LABELS,
  RegionFilter,
} from "./constants";
import type { AmbassadorProps } from "./GlobalAmbassadorsMap";

interface AmbassadorFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: AmbassadorProps;
}

interface GlobeProps {
  ambassadors: AmbassadorFeature[];
  selected: AmbassadorProps | null;
  onSelect: (a: AmbassadorProps | null) => void;
  regionFilter: RegionFilter;
}

// Zoom and tilt limits keep the globe legible without flipping over a pole.
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.8;
const MAX_TILT = 1.2;
const clampScale = (v: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, v));
const clampTilt = (v: number) => Math.max(-MAX_TILT, Math.min(MAX_TILT, v));

// cobe expects normalised [r,g,b] floats from 0 to 1.
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);

  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const BASE_RGB = hexToRgb(BASE_COLOR);
const REGION_RGB: Record<string, [number, number, number]> = Object.fromEntries(
  Object.entries(REGION_COLORS).map(([k, v]) => [k, hexToRgb(v)]),
);
// Selected marker uses white so it stays distinct from every region color.
const SELECTED_RGB: [number, number, number] = [1, 1, 1];

// Spherical centroid handles antimeridian-spanning region filters.
function sphericalCentroid(
  features: AmbassadorFeature[],
): { lat: number; lng: number } | null {
  if (!features.length) return null;
  let x = 0;
  let y = 0;
  let z = 0;
  for (const f of features) {
    const [lng, lat] = f.geometry.coordinates;
    const la = (lat * Math.PI) / 180;
    const lo = (lng * Math.PI) / 180;
    x += Math.cos(la) * Math.cos(lo);
    y += Math.cos(la) * Math.sin(lo);
    z += Math.sin(la);
  }
  const lngOut = (Math.atan2(y, x) * 180) / Math.PI;
  const latOut = (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI;

  return { lat: latOut, lng: lngOut };
}

function locationToAngles(lat: number, lng: number): [number, number] {
  return [
    Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

function isFrontFace(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
): boolean {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180 - Math.PI;
  const cosLat = Math.cos(latRad);
  const x = -cosLat * Math.cos(lngRad);
  const y = Math.sin(latRad);
  const z = cosLat * Math.sin(lngRad);

  return (
    -Math.sin(phi) * Math.cos(theta) * x +
      Math.sin(theta) * y +
      Math.cos(phi) * Math.cos(theta) * z >=
    0
  );
}

// Fixed dark theme for the ambassador map section.
const THEME = {
  dark: 1 as const,
  diffuse: 2.2,
  mapSamples: 16000,
  mapBrightness: 3.6,
  mapBaseBrightness: 0.02,
  baseColor: [0.09, 0.12, 0.16] as [number, number, number],
  markerColor: BASE_RGB,
  glowColor: [0.04, 0.07, 0.1] as [number, number, number],
  opacity: 0.92,
  markerElevation: 0.04,
};

interface LabelState {
  el: HTMLElement;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  currentOpacity: number;
  targetOpacity: number;
}

export default function Globe({
  ambassadors,
  selected,
  onSelect,
  regionFilter,
}: GlobeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.2);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const pointerStartY = useRef(0);
  const pointerMovementY = useRef(0);
  const scaleRef = useRef(1);
  const hoveredLabel = useRef(false);
  const focusRef = useRef<[number, number] | null>(null);
  const gsRef = useRef(0);
  const hoveredAmbRef = useRef<string | null>(null);

  const applyZoom = useCallback((factor: number) => {
    scaleRef.current = clampScale(scaleRef.current * factor);
  }, []);

  const ambassadorsRef = useRef(ambassadors);
  ambassadorsRef.current = ambassadors;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Decide what the globe rotates toward: a selected ambassador first, otherwise
  // the centre of the filtered continent, otherwise nothing (free auto-rotate).
  useEffect(() => {
    const ambs = ambassadorsRef.current;
    if (selected) {
      const f = ambs.find((x) => x.properties.id === selected.id);
      if (f) {
        const [lng, lat] = f.geometry.coordinates;
        focusRef.current = locationToAngles(lat, lng);
      }

      return;
    }

    if (regionFilter !== "all") {
      const c = sphericalCentroid(ambs);
      if (c) {
        focusRef.current = locationToAngles(c.lat, c.lng);

        return;
      }
    }

    focusRef.current = null;
  }, [selected, regionFilter]);

  const handleClick = useCallback((p: AmbassadorProps) => {
    const sel = selectedRef.current;
    if (sel?.id === p.id) onSelectRef.current?.(null);
    else onSelectRef.current?.(p);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const measure = () => {
      gsRef.current = wrapper.offsetWidth;
    };
    measure();
    window.addEventListener("resize", measure);

    // Scroll over the globe to zoom in/out (without scrolling the page).
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scaleRef.current = clampScale(
        scaleRef.current * (e.deltaY < 0 ? 1.08 : 0.92),
      );
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const dpr = Math.min(window.devicePixelRatio, 2);
    const gs = gsRef.current;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: gs * dpr,
      height: gs * dpr,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: THEME.dark,
      diffuse: THEME.diffuse,
      mapSamples: THEME.mapSamples,
      mapBrightness: THEME.mapBrightness,
      mapBaseBrightness: THEME.mapBaseBrightness,
      baseColor: THEME.baseColor,
      markerColor: THEME.markerColor,
      glowColor: THEME.glowColor,
      markers: [],
      scale: 1,
      offset: [0, 0],
      opacity: THEME.opacity,
      markerElevation: THEME.markerElevation,
    });

    const labelStates = new Map<string, LabelState>();
    const LERP = 0.18;

    const createLabel = (p: AmbassadorProps): LabelState => {
      const key = p.id;
      const existing = labelStates.get(key);
      if (existing) return existing;

      const el = document.createElement("div");
      el.style.cssText =
        "position:absolute;z-index:20;pointer-events:auto;transform:translate(-50%,-100%);opacity:0;display:none;cursor:pointer;margin-top:-14px;will-change:transform,opacity;font-family:inherit";

      const inner = document.createElement("div");
      inner.style.cssText =
        "display:flex;flex-direction:column;gap:3px;padding:8px 12px;border-radius:8px;white-space:nowrap;backdrop-filter:blur(10px);transition:background 0.15s,border-color 0.15s,box-shadow 0.15s";

      const nameEl = document.createElement("div");
      nameEl.textContent = `${p.flag} ${p.name}`;
      nameEl.style.cssText = "font-size:13px;font-weight:600;line-height:1.1";
      nameEl.dataset.role = "name";

      const meta = document.createElement("div");
      const region = REGION_LABELS[p.region as RegionFilter] ?? p.region;
      meta.textContent = `${p.language} · ${region}`;
      meta.style.cssText = "font-size:11px;font-weight:400;line-height:1.1";
      meta.dataset.role = "meta";

      inner.append(nameEl, meta);
      el.appendChild(inner);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        handleClick(p);
      });
      el.addEventListener("mouseenter", () => {
        hoveredLabel.current = true;
      });
      el.addEventListener("mouseleave", () => {
        hoveredLabel.current = false;
      });
      wrapper.appendChild(el);

      const state: LabelState = {
        el,
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        currentOpacity: 0,
        targetOpacity: 0,
      };
      labelStates.set(key, state);

      return state;
    };

    // Restyle labels each frame so selected pins remain visually distinct.
    const styleLabel = (state: LabelState, color: string, isSel: boolean) => {
      const inner = state.el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      const nameEl = inner.querySelector<HTMLElement>('[data-role="name"]');
      const meta = inner.querySelector<HTMLElement>('[data-role="meta"]');

      if (isSel) {
        inner.style.background = "#0D1117";
        inner.style.border = `1.5px solid ${color}`;
        inner.style.boxShadow = `0 6px 22px ${color}66`;
        if (nameEl) nameEl.style.color = "#ffffff";
        if (meta) meta.style.color = color;
      } else {
        inner.style.background = "#0D1117";
        inner.style.border = `1px solid ${color}55`;
        inner.style.boxShadow = "0 8px 24px rgba(0,0,0,0.45)";
        if (nameEl) nameEl.style.color = "#e8edf3";
        if (meta) meta.style.color = color;
      }
    };

    const hitZones = new Map<string, HTMLElement>();

    const createHitZone = (p: AmbassadorProps): HTMLElement => {
      const key = p.id;
      const existing = hitZones.get(key);
      if (existing) return existing;

      const el = document.createElement("div");
      el.style.cssText =
        "position:absolute;width:22px;height:22px;transform:translate(-50%,-50%);pointer-events:auto;cursor:pointer;z-index:15;border-radius:50%";
      el.addEventListener("mouseenter", () => {
        hoveredAmbRef.current = key;
        hoveredLabel.current = true;
      });
      el.addEventListener("mouseleave", () => {
        hoveredAmbRef.current = null;
        hoveredLabel.current = false;
      });
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        handleClick(p);
      });
      wrapper.appendChild(el);
      hitZones.set(key, el);

      return el;
    };

    const doublePi = Math.PI * 2;
    let rafId: number;
    let frameCount = 0;

    const animate = () => {
      const focus = focusRef.current;
      const ambs = ambassadorsRef.current;
      const sel = selectedRef.current;
      const size = gsRef.current;

      if (focus) {
        const [fp, ft] = focus;
        const dp = (fp - phiRef.current + doublePi) % doublePi;
        const dn = (phiRef.current - fp + doublePi) % doublePi;
        if (dp < dn) phiRef.current += dp * 0.08;
        else phiRef.current -= dn * 0.08;
        thetaRef.current = clampTilt(thetaRef.current * 0.92 + ft * 0.08);
      } else if (!pointerInteracting.current && !hoveredLabel.current) {
        // Spin horizontally; leave the user's chosen vertical tilt untouched.
        phiRef.current += 0.0024;
      }

      const curPhi = phiRef.current + pointerInteractionMovement.current / 200;
      const curTheta = clampTilt(
        thetaRef.current + pointerMovementY.current / 200,
      );

      globe.update({
        phi: curPhi,
        scale: scaleRef.current,
        theta: curTheta,
        width: size * dpr,
        height: size * dpr,
        markers: ambs.map((a, i) => {
          const p = a.properties;
          const [lng, lat] = a.geometry.coordinates;
          const isSel = sel?.id === p.id;

          return {
            location: [lat, lng] as [number, number],
            size: isSel ? 0.1 : 0.045,
            id: `amb-${i}`,
            color: isSel ? SELECTED_RGB : REGION_RGB[p.region] ?? BASE_RGB,
          };
        }),
      });

      frameCount++;
      if (frameCount % 6 === 0 && size > 0) {
        // cobe exposes each marker as a percentage-positioned anchor div.
        const anchors = wrapper.querySelectorAll<HTMLElement>(
          'div[style*="anchor-name"]',
        );
        const anchorMap = new Map<number, { lp: number; tp: number }>();
        anchors.forEach((a) => {
          const nm =
            a.style.getPropertyValue("anchor-name") ||
            (a.style as unknown as Record<string, string>)["anchorName"] ||
            "";
          const m = nm.match(/--cobe-amb-(\d+)/);
          if (!m) return;
          const l = parseFloat(a.style.left);
          const t = parseFloat(a.style.top);
          if (!Number.isNaN(l) && !Number.isNaN(t))
            anchorMap.set(parseInt(m[1]), { lp: l, tp: t });
        });

        const hovered = hoveredAmbRef.current;
        const activeHitKeys = new Set<string>();
        const showLabelKeys = new Set<string>();

        for (let i = 0; i < ambs.length; i++) {
          const ap = anchorMap.get(i);
          if (!ap) continue;
          const p = ambs[i].properties;
          const [lng, lat] = ambs[i].geometry.coordinates;
          const front = isFrontFace(lat, lng, curPhi, curTheta);
          const x = (ap.lp / 100) * size;
          const y = (ap.tp / 100) * size;

          if (front) {
            activeHitKeys.add(p.id);
            const hz = createHitZone(p);
            hz.style.left = `${x}px`;
            hz.style.top = `${y}px`;
            hz.style.display = "";

            if (sel?.id === p.id || hovered === p.id) {
              showLabelKeys.add(p.id);
              const color = REGION_COLORS[p.region] ?? BASE_COLOR;
              const state = createLabel(p);
              styleLabel(state, color, sel?.id === p.id);
              state.targetX = x;
              state.targetY = y - 14;
              state.targetOpacity = 1;
              state.el.style.display = "";
              state.el.style.pointerEvents = "auto";
            }
          }
        }

        for (const [key, el] of hitZones) {
          if (!activeHitKeys.has(key)) el.style.display = "none";
        }

        for (const [key, state] of labelStates) {
          if (!showLabelKeys.has(key)) state.targetOpacity = 0;
        }
      }

      for (const [, state] of labelStates) {
        state.currentX += (state.targetX - state.currentX) * LERP;
        state.currentY += (state.targetY - state.currentY) * LERP;
        state.currentOpacity +=
          (state.targetOpacity - state.currentOpacity) * LERP;
        if (state.currentOpacity < 0.01) {
          state.el.style.display = "none";
          state.el.style.pointerEvents = "none";
          continue;
        }
        state.el.style.left = `${state.currentX}px`;
        state.el.style.top = `${state.currentY}px`;
        state.el.style.opacity = `${state.currentOpacity}`;
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    setTimeout(() => {
      if (canvas) canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      window.removeEventListener("resize", measure);
      canvas.removeEventListener("wheel", onWheel);
      for (const s of labelStates.values()) s.el.remove();
      labelStates.clear();
      for (const el of hitZones.values()) el.remove();
      hitZones.clear();
    };
  }, [handleClick]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          width: "min(92%, min(calc(100vh - 240px), 640px))",
          aspectRatio: "1",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            // Grabbing releases any region or marker focus during drag.
            focusRef.current = null;
            pointerInteracting.current =
              e.clientX - pointerInteractionMovement.current;
            pointerStartY.current = e.clientY - pointerMovementY.current;
            if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            phiRef.current += pointerInteractionMovement.current / 200;
            pointerInteractionMovement.current = 0;
            thetaRef.current = clampTilt(
              thetaRef.current + pointerMovementY.current / 200,
            );
            pointerMovementY.current = 0;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            phiRef.current += pointerInteractionMovement.current / 200;
            pointerInteractionMovement.current = 0;
            thetaRef.current = clampTilt(
              thetaRef.current + pointerMovementY.current / 200,
            );
            pointerMovementY.current = 0;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              pointerInteractionMovement.current =
                e.clientX - pointerInteracting.current;
              pointerMovementY.current = e.clientY - pointerStartY.current;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              pointerInteractionMovement.current =
                e.touches[0].clientX - pointerInteracting.current;
              pointerMovementY.current =
                e.touches[0].clientY - pointerStartY.current;
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
            contain: "layout paint size",
            opacity: 0,
            transition: "opacity 1s ease",
          }}
        />
      </div>

      {/* Zoom controls */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 4,
          background: "rgba(13,17,23,0.82)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          backdropFilter: "blur(8px)",
          zIndex: 950,
        }}
      >
        <ZoomButton label="Zoom in" onClick={() => applyZoom(1.22)}>
          <Plus size={18} strokeWidth={2.4} aria-hidden />
        </ZoomButton>
        <div
          style={{ height: 1, width: 18, background: "rgba(255,255,255,0.12)" }}
        />
        <ZoomButton label="Zoom out" onClick={() => applyZoom(0.82)}>
          <Minus size={18} strokeWidth={2.4} aria-hidden />
        </ZoomButton>
      </div>
    </div>
  );
}

function ZoomButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: 8,
        background: "transparent",
        color: "rgba(255,255,255,0.75)",
        fontSize: 20,
        lineHeight: 1,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(29,174,238,0.15)";
        e.currentTarget.style.color = BASE_COLOR;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
      }}
    >
      {children}
    </button>
  );
}
