export function getBrandColor(brand: string) {
  return BRAND_COLORS[brand] ?? DEFAULT_PIN_COLOR;
}

export function parseStores(raw: RawData): StoreEntry[] {
  const out: StoreEntry[] = [];

  let seq = 0;

  for (const brand in raw) {
    for (const state in raw[brand]) {
      for (const city in raw[brand][state]) {
        for (const loc in raw[brand][state][city]) {
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
            lat: loc.coordinates.lat,
            lng: loc.coordinates.lng,
            country,
          });
        }
      }
    }
  }

  return out;
}

