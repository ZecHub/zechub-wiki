import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parseStores } from "./helpers";

interface RawLocaion {
  address: string;
  coordinates: { lat: number; lon: number };
}

type RawData = Record<string, Record<string, Record<string, RawLocaion[]>>>;

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

const BRAND_COLORS: Record<string, string> = {
  BancoAgricola: "#1D9E75",
  "Barnes & Noble": "#185FA5",
  "Baskin-Robbins": "#D4537E",
  "CoCo Bubble Tea": "#BA7517",
  "Famous Footwear": "#D85A30",
  Fresh: "#639922",
  GameStop: "#E24B4A",
  "International Shoppes": "#7F77DD",
  Nordstrom: "#185FA5",
  "Nordstrom Rack": "#0C447C",
  Regal: "#7F77DD",
  Sheetz: "#BA7517",
  "Ulta Beauty": "#D4537E",
};

const DEFAULT_PIN_COLOR = "#888780";

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

}
