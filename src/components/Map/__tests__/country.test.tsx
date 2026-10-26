import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import SPEDNMap, { type RawData } from "../SpednMap";
import { parseStores } from "../helpers";

// A fixed fixture keeps these tests independent of routine merchant-data edits.
const locations: RawData = {
  CoCoBubbleTea: {
    ON: {
      Toronto: [
        {
          address: "1 Main St, Toronto, ON, Canada",
          coordinates: { latitude: 43.7, longitude: -79.4 },
        },
      ],
      London: [
        {
          address: "2 Main St, London, ON, Canada",
          coordinates: { latitude: 43, longitude: -81.3 },
        },
      ],
    },
  },
  BancoAgricola: {
    "Oax.": {
      Oaxaca: [
        {
          address: "3 Main St, Oaxaca, Oax., Mexico",
          coordinates: { latitude: 17.1, longitude: -96.7 },
        },
      ],
    },
    Duarte: {
      Castillo: [
        {
          address: "4 Main St, Castillo, Dominican Republic",
          coordinates: { latitude: 19.2, longitude: -70 },
        },
      ],
    },
  },
  ExampleBrand: {
    NM: {
      "Santa Fe": [
        {
          address: "5 Main St, Santa Fe, New Mexico, United States",
          coordinates: { latitude: 35.7, longitude: -105.9 },
        },
      ],
    },
  },
};

jest.mock("next/head", () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

function parseAddress(address: string) {
  return parseStores({
    ExampleBrand: {
      ExampleState: {
        ExampleCity: [
          { address, coordinates: { latitude: 1, longitude: 2 } },
        ],
      },
    },
  })[0];
}

describe("SPEDN country classification", () => {
  const stores = parseStores(locations);
  const canadianStores = stores.filter((store) =>
    store.address.endsWith(", Canada"),
  );

  it("covers both Canadian cities in the fixed fixture", () => {
    expect(canadianStores.map((store) => store.city)).toEqual(["Toronto", "London"]);
  });

  it.each(canadianStores)("classifies $address as Canada", (store) => {
    expect(store.country).toBe("Canada");
  });

  it("keeps the fixture's Mexico, Dominican Republic, and US classifications", () => {
    expect(stores.map((store) => store.country)).toEqual([
      "Canada", "Canada", "Mexico", "Dominican Republic", "United States",
    ]);
  });

  it.each([
    ["1 Main St, Toronto, ON, Canada", "Canada"],
    ["1 Main St, Toronto, ON,  cAnAdA  ", "Canada"],
    ["1 Main St, Mexico City,  MEXICO  ", "Mexico"],
    ["1 Main St, Santo Domingo,  dominican republic  ", "Dominican Republic"],
    ["1 Main St, Canada, , ", "Canada"],
    ["1 Main St, Mexico, ", "Mexico"],
    ["1 Main St, Dominican Republic, , ", "Dominican Republic"],
    ["1 Main St, Santa Fe, New Mexico", "United States"],
    ["1 Main St, Santa Fe, New Mexico, ", "United States"],
    ["1 Main St, Santa Fe, New Mexico, United States", "United States"],
    ["1 Mexico Ave, Dallas, TX", "United States"],
    ["1 Canada Way, Dallas, TX", "United States"],
    ["1 Dominican Republic Way, Dallas, TX", "United States"],
    ["1 Main St, Unknown Country", "United States"],
    ["1 Main St", "United States"],
    ["", "United States"],
    [", , ", "United States"],
  ])("classifies only a complete country suffix: %s", (address, expected) => {
    expect(parseAddress(address).country).toBe(expected);
  });

  it("keeps unrelated parsed fields unchanged", () => {
    expect(parseAddress("1 Main St, Canada")).toEqual({
      id: "store-0",
      brand: "Example Brand",
      state: "ExampleState",
      city: "ExampleCity",
      address: "1 Main St, Canada",
      lat: 1,
      lng: 2,
      country: "Canada",
    });
  });
});

describe("SPEDN Canadian country displays", () => {
  const originalFetch = global.fetch;
  const originalScroll = HTMLElement.prototype.scrollIntoView;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => locations });
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalScroll) {
      HTMLElement.prototype.scrollIntoView = originalScroll;
    } else {
      delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
    }
  });

  it("shows Canada in the header, list badges, and selected-store details", async () => {
    render(<SPEDNMap />);

    await waitFor(() => {
      expect(screen.getByText(/locations across/)).toHaveTextContent("Canada");
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Search stores" }), {
      target: { value: "Canada" },
    });

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(within(row).getByText("Canada")).toBeInTheDocument();
    }

    fireEvent.click(rows[0]);
    const detailPanel = document.querySelector(".spedn-detail-panel");
    expect(detailPanel).not.toBeNull();
    expect(within(detailPanel as HTMLElement).getByText("Canada")).toBeInTheDocument();

    // The test does not opt into map tiles or contact an external map service.
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/spedn/locations.json");
  });
});
