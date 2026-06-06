"use client";

import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parseStores } from "./helpers";

interface RawLocaion {
  address: string;
  coordinates: { latitude: number; longitude: number };
}

export type RawData = Record<string, Record<string, Record<string, RawLocaion[]>>>;

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
  const markerRef = useRef<any>(null);
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
        zoomControl: false,
        attributionControl: false,
      });

      // Tile Layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
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
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync markers wiht filtered stores
  const handleSelectedStore = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
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

      {/* Header */}
      <div
        style={{
          padding: "28px 28px 20px",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
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
      </div>
    </>
  );
}
