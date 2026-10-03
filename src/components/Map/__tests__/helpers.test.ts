import assert from "node:assert/strict";
import { BRAND_COLORS, getBrandColor, parseStores } from "../helpers";
import type { RawData } from "../SpednMap";

const brands: [string, string][] = [
  ["BancoAgricola", "BancoAgricola"],
  ["BarnesAndNoble", "Barnes & Noble"],
  ["BaskinRobbins", "Baskin-Robbins"],
  ["CoCoBubbleTea", "CoCo Bubble Tea"],
  ["TheCoffeeBean", "The Coffee Bean & Tea Leaf"],
  ["FamousFootwear", "Famous Footwear"],
  ["Fresh", "Fresh"],
  ["GameStop", "GameStop"],
  ["InternationalShoppes", "International Shoppes"],
  ["Kiehls", "Kiehl's"],
  ["LuxuryBeautyStore", "Luxury Beauty Store"],
  ["LondonJewelers", "London Jewelers"],
  ["Mikimoto", "Mikimoto"],
  ["Nordstrom", "Nordstrom"],
  ["NordstromRack", "Nordstrom Rack"],
  ["Regal", "Regal"],
  ["Sheetz", "Sheetz"],
  ["UltaBeauty", "Ulta Beauty"],
];

function fixture(brand: string): RawData {
  return {
    [brand]: {
      Texas: {
        Dallas: [
          {
            address: "123 Main St, Dallas, TX, United States",
            coordinates: { latitude: 32.7767, longitude: -96.797 },
          },
        ],
      },
    },
  };
}

describe("SPEDN store brand identity", () => {
  for (const [raw, display] of brands) {
    it(`uses the palette name and color for ${raw}`, () => {
      const [store] = parseStores(fixture(raw));
      assert.equal(store.brand, display);
      assert.ok(Object.hasOwn(BRAND_COLORS, store.brand));
      assert.equal(getBrandColor(store.brand), BRAND_COLORS[display]);
    });
  }

  it("preserves generic formatting and the fallback color for an unknown brand", () => {
    const [store] = parseStores(fixture("FutureCoffeeShop"));
    assert.equal(store.brand, "Future Coffee Shop");
    assert.equal(getBrandColor(store.brand), "#888780");
  });

  it("preserves generic formatting for inherited object-property names", () => {
    for (const raw of ["constructor", "toString", "__proto__"]) {
      const [store] = parseStores(fixture(raw));
      assert.equal(store.brand, raw.replace(/([A-Z])/g, " $1").trim());
    }
  });

  it("preserves location fields, order, and unique IDs", () => {
    const data = { ...fixture("GameStop"), ...fixture("Nordstrom") };
    const stores = parseStores(data);
    assert.equal(stores.length, 2);
    assert.deepEqual(stores.map((store) => store.id), ["store-0", "store-1"]);
    assert.deepEqual(stores[0], {
      id: "store-0",
      brand: "GameStop",
      state: "Texas",
      city: "Dallas",
      address: "123 Main St, Dallas, TX, United States",
      lat: 32.7767,
      lng: -96.797,
      country: "United States",
    });
  });

  it("handles an empty dataset", () => {
    assert.deepEqual(parseStores({}), []);
  });
});
