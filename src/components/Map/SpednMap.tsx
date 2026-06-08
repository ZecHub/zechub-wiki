"use client";

import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DetailPanel } from "./components/detail-panel";
import { StoreListItem } from "./components/store-list-item";
import { BRAND_COLORS, getBrandColor, parseStores } from "./helpers";
import { makePinSVG } from "./makePinSVG";
import "./style.css";

interface RawLocaion {
  address: string;
  coordinates: { latitude: number; longitude: number };
}

export type RawData = Record<
  string,
  Record<string, Record<string, RawLocaion[]>>
>;

export interface StoreEntry {
  id: string;
  brand: string;
  state: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  country: string;
}

export default function SPEDNMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  const [allStores, setAllStores] = useState<StoreEntry[]>([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  //   load data
  useEffect(() => {
    fetch("/spedn/locations.json")
      .then((r) => r.json())
      .then((raw: RawData) => {
        setAllStores(parseStores(raw));

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // filter list
  const filteredStores = useMemo(() => {
    const q = search.toLowerCase().trim();

    return allStores.filter((s) => {
      if (brandFilter && s.brand !== brandFilter) {
        return false;
      }
      if (!q) {
        return true;
      }

      return (
        s.brand.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    });
  }, [allStores, search, brandFilter]);

  const selectedStore = useMemo(
    () => filteredStores.find((s) => s.id === selectedId) ?? null,
    [filteredStores, selectedId],
  );

  const brands = useMemo(
    () => [...new Set(allStores.map((s) => s.brand))].sort(),
    [allStores],
  );

  // init Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (mapRef.current) return;

      const map = L.map(mapContainerRef.current!, {
        center: [37.5, -96],
        zoom: 4,
        zoomControl: true,
        attributionControl: true,
      });

      // Tile Layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          opacity: 0.7,
        },
      ).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          opacity: 0.6,
        },
      ).addTo(map);

      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(
          '© <a href="https://carto.com">CARTO</a> · © <a href="https://openstreetmap.org">OSM</a>',
        )
        .addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current?.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, []);

  // Sync markers wiht filtered stores
  const handleSelectedStore = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    if (!mapReady || !layerRef.current) {
      return;
    }

    import("leaflet").then((L) => {
      layerRef.current.clearLayers();
      markersRef.current = [];

      filteredStores.forEach((store) => {
        const icon = L.divIcon({
          className: "",
          iconSize: [22, 28],
          iconAnchor: [11, 28],
          html: makePinSVG(getBrandColor(store.brand)),
        });

        const marker = L.marker([store.lat, store.lng], { icon });
        marker.on("click", () => handleSelectedStore(store.id));

        marker.bindTooltip(
          `<div class="spedn-tooltip">
            <div style="font-size:12px;font-weight:500">${store.brand}</div>
            <div style="font-size:11px;opacity:0.7;margin-top:2px">${store.city}, ${store.state}</div>
           </div>`,
          { direction: "top", offset: [0, 12] },
        );

        layerRef.current.addLayer(marker);
        markersRef.current.push({ id: store.id, marker });
      });
    });
  }, [filteredStores, mapReady, handleSelectedStore]);

  //   Jump to selected store
  useEffect(() => {
    if (!mapRef.current || !selectedStore) {
      return;
    }

    mapRef.current.flyTo([selectedStore.lat, selectedStore.lng], 14, {
      duration: 0.9,
      easrLinearity: 0.35,
    });
  }, [selectedStore]);

  // Scroll active list item into view
  useEffect(() => {
    if (!selectedId) return;
    document
      .getElementById(`si-${selectedId}`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setBrandFilter("");
    setSelectedId(null);
    if (mapRef.current) mapRef.current.flyTo([32, -90], 4, { duration: 0.8 });
  }, []);

  return (
    <>
      <Head>
        <title>SPEDN Store Locator - ZecHub</title>
        <meta
          name="description"
          content="Find stores where you can pay with Zcash using the Flexa/SPEDN netword"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </Head>

      <div
        className="spedn-root"
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 28px 20px",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            flexShrink: 0,
          }}
        >
          {/* <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
            }}
          > */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "var(--color-background-success)",
              color: "var(--color-text-success)",
              border: "0.5px solid var(--color-border-success)",
              borderRadius: 20,
              padding: "3px 11px",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.05em",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--color-text-success)",
              }}
            />
            SPEDN · FLEXA NETWORK
          </div>
          <h1
            style={{
              fontSize: "clamp(20px, 3.5vw, 30px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              margin: "0 0 6px",
              lineHeight: 1.15,
              color: "var(--color-text-primary)",
            }}
          >
            Pay with ZEC in-store
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {allStores.length} locations across{" "}
            {[...new Set(allStores.map((s) => s.country))].join(", ")} accepting
            ZEC via Flexa
          </p>
        </div>
        {/* </div> */}

        {/* Main */}
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            minHeight: 0,

            // border: "0.5px solid var(--color-border-tertiary)",
            // borderRadius: "var(--border-radius-lg)",
            // margin: "20px",
            // height: "calc(100vh-200px)",
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              width: 200,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              borderRight: "0.5px solid var(--color-border-tertiary)",
              background: "var(--color-background-primary)",
              height: 900,
              overflow:'scroll'
            }}
          >
            {/* Search */}
            <div
              style={{
                padding: "10px 12px",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    color: "var(--color-text-tertiary)",
                    pointerEvents: "none",
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search brand, city, state..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);

                    setSelectedId(null);
                  }}
                  aria-label="Search stores"
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 32px",
                    fontSize: 13,
                    borderRadius: "var(--border-radius-md)",
                    border: "0.5px solid var(--color-border-secondary",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              {/* Band Filter */}
              <select
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value);
                  setSelectedId(null);
                }}
                aria-label="filter by brand"
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  fontSize: 13,
                  borderRadius: "var(--border-radius-md)",
                  border: "0.5px solid var(--color-border-secondary)",
                  background: "var(--color-background-secondary)",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                }}
              >
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 14px",
                fontSize: 11,
                color: "var(--color-text-tertiary)",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
              }}
            >
              {filteredStores.length} locations
              {filteredStores.length !== 1 ? "s" : ""}
              {brandFilter || search ? "matching" : ""}
              {(search || brandFilter) && (
                <button
                  onClick={clearFilters}
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-tertiary)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Store list */}
            <div
              style={{ flex: 1, overflowY: "auto", minHeight: 0 }}
              role="list"
            >
              {loading ? (
                <div
                  style={{
                    padding: 24,
                    textAlign: "center",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {" "}
                  Loading stores...
                </div>
              ) : filteredStores.length === 0 ? (
                <div
                  style={{
                    padding: 32,
                    textAlign: "center",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  No stores match your search
                </div>
              ) : (
                filteredStores.map((s) => (
                  <StoreListItem
                    key={s.id}
                    isActive={s.id === selectedId}
                    onClick={() => handleSelectedStore(s.id)}
                    store={s}
                  />
                ))
              )}
            </div>

            {/* Legend */}
            <div
              style={{
                padding: "10px 14px",
                borderTop: "0.5px solid var(--color-border-tertiary)",
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {Object.entries(BRAND_COLORS)
                .slice(0, 6)
                .map(([brand, color]) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 10,
                      color: "var(--color-text-secondary)",
                    }}
                    key={brand}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    {brand}
                  </div>
                ))}
            </div>
          </div>

          {/* Map */}

          <div
            style={{
              flex: 1,
              position: "relative",
              minHeight: 0,
            }}
          >
            {loading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--color-background-secondary)",
                  fontSize: 13,
                  color: "var(--color-text-secondary) ",
                }}
              >
                Loading map...
              </div>
            )}
            <div
              ref={mapContainerRef}
              style={{
                // width: "100%",
                // height: "100%",
                position: "absolute",
                inset: 0,
              }}
            />
            <DetailPanel
              store={selectedStore}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
