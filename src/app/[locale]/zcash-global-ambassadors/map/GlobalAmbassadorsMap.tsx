import Head from "next/head";
import { IBM_Plex_Sans } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BASE_COLOR,
  REGION_COLORS,
  REGION_LABELS,
  RegionFilter,
} from "./constants";
import { FilterBar } from "./filter-bar";
import Globe from "./Globe";
import { Globe2, Map as MapIcon } from "lucide-react";
import { PinDetails } from "./pin-details";
import { StatsBar } from "./stats-bar";
import { useLanguage } from "@/context/LanguageContext";
import "./style.css";

// Self-hosted at build time by next/font (no runtime request to Google).
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  // IBM Plex Sans on Google Fonts tops out at 700 (the old @import requested
  // 800, which Google silently ignored).
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

type ViewMode = "globe" | "map";

export interface AmbassadorProps {
  id: string;
  name: string;
  flag: string;
  description: string;
  image: string;
  twitter: string;
  xHandle: string;
  projectSite: string | null;
  blog: string | null;
  countryCode: string;
  region: string;
  language: string;
  pinNote: string;
  coordsSource: string;
  active: boolean;
  lastUpdate: string;
  [index: string]: any;
}

interface AmbassadorFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: AmbassadorProps;
}

interface GeoJSONData {
  type: "FeatureCollection";
  metadata: Record<string, string | number>;
  features: AmbassadorFeature[];
}

export default function GlobalAmbassadorsMap() {
  const { t } = useLanguage();
  const amb = t?.pages?.zcashGlobalAmbassadors;
  const mapContainRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const layerGroupRef = useRef<any>(null);

  const [ambassadors, setAmbassadors] = useState<AmbassadorFeature[]>([]);
  const [selected, setSelected] = useState<AmbassadorProps | null>(null);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("globe");
  // Don't contact CARTO (third-party map tiles) until the user opts in.
  const [mapEnabled, setMapEnabled] = useState(false);

  // Ambassadors per region for filter bar
  const regionCounts = ambassadors.reduce<Record<string, number>>((acc, f) => {
    const r = f.properties.region;
    acc[r] = (acc[r] ?? 0) + 1;

    return acc;
  }, {});

  const visibleAmbassadors = ambassadors.filter(
    (amb) => regionFilter === "all" || amb.properties.region === regionFilter,
  );

  // Fetch GeoJSON
  useEffect(() => {
    fetch("/map-data/ambassadors.geojson")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        return res.json() as Promise<GeoJSONData>;
      })
      .then((d) => {
        setAmbassadors(d.features.filter((f) => f.properties.active));
        setLoading(false);
      })
      .catch((err) => {
        setError(amb?.loadError ?? "Could not load ambassador data.");
        setLoading(false);
        console.error(err);
      });
    console.log("role...");
  }, []);

  // Init Leaflet map (only for the "map" view, and only once the user has
  // opted in to loading third-party CARTO tiles).
  useEffect(() => {
    if (viewMode !== "map" || !mapEnabled) return;
    if (!mapContainRef.current || mapRef.current) return;

    let cancelled = false;

    // Import Leaflet dynamically
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css" as any).catch(console.error),
    ]).then(([L]) => {
      if (cancelled || mapRef.current || !mapContainRef.current) return;

      // Note: markers use L.divIcon (custom SVG pins), so L.Icon.Default is
      // never instantiated — no marker-image URLs need to be configured.

      const map = L.map(mapContainRef.current!, {
        center: [20, 20],
        zoom: 2,
        minZoom: 2,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark styled tiles via CartoDB dark matter
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 },
      ).addTo(map);

      // Country name label to top (separate layer, lighter)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, opacity: 0.5 },
      ).addTo(map);

      // Attribution - minimal
      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(
          `© <a href="https://carto.com">CARTO</a> · © <a href="https://openstreetmap.org">OSM</a>`,
        )
        .addTo(map);

      // Zoom control
      L.control.zoom({ position: "bottomright" }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [viewMode, mapEnabled]);

  // Render
  const renderMarkers = useCallback(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();
    markersRef.current = [];

    visibleAmbassadors.forEach((amb) => {
      const p = amb.properties;
      const [lon, lat] = amb.geometry.coordinates;
      const color = REGION_COLORS[p.region] ?? BASE_COLOR;

      // Custom SVG pin marker
      const svgIcon = L.divIcon({
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 16],
        popupAnchor: [0, -38],
        html: `
          <div style='
          width:36px;height:36px;position:relative;
          filter:drop-shadow(0 4px 12px ${color}66);
          cursor:pointer;
          transition:transform 0.15s;
          ' class='amb-pin'>
          <svg viewBox='0 0 36 42' fill='none' xmlns="http://www.w3.org/2000/svg">
               <path d="M18 2C10.268 2 4 8.268 4 16c0 10 14 26 14 26s14-16 14-26c0-7.732-6.268-14-14-14z"
                fill="${color}" opacity="0.92"/>
              <circle cx="18" cy="16" r="6" fill="white" opacity="0.9"/>
          </div>
          <div style="position:absolute;top:7px;left:50%;transform:translateX(-50%);font-size:13px;line-height:1;">${p.flag}</div>
        `,
      });

      const marker = L.marker([lat, lon], { icon: svgIcon });

      marker.on("click", () => {
        setSelected(p);
      });

      // Tooltip on hover
      marker.bindTooltip(
        `
          <div style="
          background:#0D1117;border:1px solid ${color}55;
          border-radius:8px;padding:8px 12px;
          font-size:13px;font-weight:600;color:#e8edf3;
          pointer-events:none;
          ">
          ${p.flag}${" "}${p.name}
          <div style='font-size:11px;color:${color};margin-top:2px;font-weight:400'>
            ${p.language} · ${REGION_LABELS[p.region as RegionFilter] ?? p.region}
            </div> 
          </div>
        `,
        {
          permanent: false,
          direction: "top",
          offset: [0, -10],
          opacity: 1,
          className: "zechub-tooltip",
        },
      );

      layerGroupRef.current.addLayer(marker);
      markersRef.current.push(marker);
    });
  }, [visibleAmbassadors]);

  // Re-render markers when Leaflet is ready and data is loaded
  useEffect(() => {
    if (!mapReady) return;

    renderMarkers();
  }, [mapReady, renderMarkers]);

  // Fly to selected
  useEffect(() => {
    if (!selected || !mapRef.current) return;

    const feature = ambassadors.find(
      (amb) => amb.properties.id === selected.id,
    );
    if (!feature) return;

    const [lon, lat] = feature.geometry.coordinates;
    mapRef.current.flyTo([lat, lon], 5, { duration: 1.2, easeLinearity: 0.3 });
  }, [selected, ambassadors]);

  const handleClose = useCallback(() => {
    setSelected(null);
    mapRef.current?.flyTo([20, 20], 2, { duration: 1.0 });
  }, []);

  return (
    <>
      <Head>
        <title>Zcash Global Ambassador · ZecHub</title>
        <meta
          name="description"
          content="Explore the worldwide network of Zcash Ambassador communities"
        />
      </Head>

      {/* Page wrapper */}
      <div
        className={ibmPlexSans.variable}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#070C10",
          color: "#e8edf3",
          fontFamily: "var(--font-ibm-plex-sans), 'Inter', sans-serif",
        }}
      >
        {/* Page header */}
        <div style={{ padding: "32px 32px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(29,174,238,0.1)",
                  border: "1px solid rgba(29,174,238,0.25)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  color: BASE_COLOR,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: BASE_COLOR,
                  }}
                />
                GLOBAL NETWORK
              </div>

              <h1
                style={{
                  fontSize: "clamp(24px, 4vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: "0 0 8px",
                  lineHeight: 1.1,
                }}
              >
                {viewMode === "globe"
                  ? (amb?.globeTitle ?? "Zcash Ambassador Globe")
                  : (amb?.mapTitle ?? "Zcash Ambassador Map")}
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#8B9EB7",
                  margin: 0,
                  maxWidth: 560,
                  lineHeight: 1.6,
                }}
              >
                {(amb?.mapSubtitle ??
                  "Community-led Zcash advocacy across {count} active communities.").replace(
                  "{count}",
                  String(ambassadors.length),
                )}
              </p>
            </div>

            {/* View toggle: Globe / Map */}
            <div
              style={{
                display: "inline-flex",
                gap: 4,
                padding: 4,
                background: "rgba(13,17,23,0.82)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                backdropFilter: "blur(8px)",
                flexShrink: 0,
              }}
            >
              {(["globe", "map"] as ViewMode[]).map((mode) => {
                const isActive = viewMode === mode;

                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    title={mode === "globe" ? (amb?.globeView ?? "Globe view") : (amb?.mapView ?? "Map view")}
                    aria-pressed={isActive}
                    aria-label={mode === "globe" ? (amb?.globeView ?? "Globe view") : (amb?.mapView ?? "Map view")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                      transition: "all 0.15s",
                      background: isActive ? BASE_COLOR : "transparent",
                      color: isActive ? "#06121A" : "rgba(255,255,255,0.65)",
                    }}
                  >
                    {mode === "globe" ? (
                      <Globe2 size={15} strokeWidth={2.2} aria-hidden />
                    ) : (
                      <MapIcon size={15} strokeWidth={2.2} aria-hidden />
                    )}
                    {mode === "globe" ? "Globe" : "Map"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map container */}
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: "calc(100vh - 160px)",
          }}
        >
          {/* Globe (cobe) or Leaflet mount point */}
          {viewMode === "globe" ? (
            <Globe
              ambassadors={visibleAmbassadors}
              selected={selected}
              onSelect={setSelected}
              regionFilter={regionFilter}
            />
          ) : (
            <div
              ref={mapContainRef}
              style={{ position: "absolute", inset: 0 }}
            />
          )}

          {/* Click-to-load consent: don't contact CARTO until the user asks. */}
          {viewMode === "map" && !mapEnabled && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1050,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 24,
                textAlign: "center",
                background: "#070C10",
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#E6EDF5" }}>
                {amb?.mapTitle ?? "Interactive map"}
              </p>
              <p style={{ fontSize: 12, margin: 0, maxWidth: "44ch", color: "#8B9EB7" }}>
                {amb?.mapConsentText ??
                  "Loads map tiles from a third party (CARTO). Click to load."}
              </p>
              <button
                type="button"
                onClick={() => setMapEnabled(true)}
                style={{
                  cursor: "pointer",
                  padding: "8px 18px",
                  borderRadius: 20,
                  border: `0.5px solid ${BASE_COLOR}`,
                  background: "rgba(29,174,238,0.12)",
                  color: "#E6EDF5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {amb?.mapConsentButton ?? "Load interactive map"}
              </button>
            </div>
          )}

          {/* Loading overlay */}
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#070C10",
                zIndex: 1100,
              }}
            >
              <div style={{ textAlign: "center", color: "#8B9EB7" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: "3px solid rgba(29,174,238,0.2)",
                    borderTopColor: BASE_COLOR,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 12px",
                  }}
                />
                Loading ambassador data...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                background: "rgba(13,17,23,0.95)",
                border: "1px solid rgba(255,80,80,0.3)",
                borderRadius: 12,
                padding: "20px 28px",
                color: "#ff6b6b",
                zIndex: 11000,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Filter */}
          {!loading && (
            <FilterBar
              active={regionFilter}
              counts={regionCounts}
              onChange={setRegionFilter}
            />
          )}

          {/* Stats */}
          {!loading && (
            <StatsBar
              total={ambassadors.length}
              visible={visibleAmbassadors.length}
            />
          )}

          {/* Details panel */}
          <PinDetails ambassador={selected!} onClose={handleClose} />
        </div>
      </div>
    </>
  );
}
