import { RawData, StoreEntry } from "./SpednMap";

export const BRAND_COLORS: Record<string, string> = {
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

export function getBrandColor(brand: string) {
  return BRAND_COLORS[brand] ?? DEFAULT_PIN_COLOR;
}

export function parseStores(raw: RawData): StoreEntry[] {
  const out: StoreEntry[] = [];

  let seq = 0;

  for (const brand in raw) {
    for (const state in raw[brand]) {
      for (const city in raw[brand][state]) {
        for (const loc of raw[brand][state][city]) {
          const addr = loc.address;
          const country = /Mexico/i.test(addr)
            ? "Mexico"
            : /Dominican Republic/i.test(addr)
              ? "Dominican Republic"
              : "United States";

          out.push({
            id: `store-${seq++}`,
            brand,
            state,
            city,
            address: addr,
            lat: loc.coordinates.latitude,
            lng: loc.coordinates.longitude,
            country,
          });
        }
      }
    }
  }

  return out;
}
