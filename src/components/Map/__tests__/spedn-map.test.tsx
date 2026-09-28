import { render, screen, waitFor } from "@testing-library/react";
import SPEDNMap from "../SpednMap";
import fs from "fs";
import path from "path";

// Leaflet needs real DOM geometry (map container sizing, canvas etc.) that
// jsdom cannot provide. The map only initializes after the user opts in
// ("Load interactive map"), but the component still imports leaflet lazily
// on mount. Mock the dynamic import so the component renders headlessly.
jest.mock("next/head", () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

jest.mock("leaflet", () => {
  const noop = () => {};
  return {
    __esModule: true,
    default: {
      map: noop,
      tileLayer: () => ({ addTo: noop }),
      divIcon: () => ({}),
      marker: () => ({
        bindTooltip: noop,
        on: noop,
      }),
      layerGroup: () => ({ addTo: noop, clearLayers: noop }),
      control: {
        attribution: () => ({ addAttribution: noop, addTo: noop }),
        zoom: () => ({ addTo: noop }),
      },
    },
  };
});

// The component fetches "/spedn/locations.json" on mount.
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({
      BarnesAndNoble: {
        Texas: {
          Dallas: [
            {
              address: "123 Main St, Dallas, TX, United States",
              coordinates: { latitude: 32.7767, longitude: -96.797 },
            },
          ],
        },
      },
    }),
  }) as unknown as typeof fetch;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("SPEDNMap mobile responsiveness", () => {
  it("renders the layout classes the responsive CSS targets", async () => {
    render(<SPEDNMap />);

    await waitFor(() => {
      expect(
        screen.getByText("Pay with ZEC in-store"),
      ).toBeInTheDocument();
    });

    // Layout primitives must be present for the media queries to apply.
    expect(document.querySelector(".spedn-root")).not.toBeNull();
    expect(document.querySelector(".spedn-main")).not.toBeNull();
    expect(document.querySelector(".spedn-sidebar")).not.toBeNull();
    expect(document.querySelector(".spedn-map")).not.toBeNull();
  });

  it("does not keep the fixed 240px sidebar inline on mobile", async () => {
    render(<SPEDNMap />);

    // The old inline width:240 forced a desktop layout that squeezed the map
    // to ~135px on a 375px phone. It must be gone from the markup.
    const sidebar = await screen.findByRole("complementary").catch(() => null);
    const aside = document.querySelector(".spedn-sidebar");
    expect(aside).not.toBeNull();
    expect(aside?.getAttribute("style") ?? "").not.toContain("width: 240");
  });

  it("defines the mobile media-query rules in style.css", () => {
    const css = fs.readFileSync(
      path.join(__dirname, "..", "style.css"),
      "utf8",
    );

    // The whole point of the bounty: a @media query that switches the fixed
    // row layout to a stacked column layout on small screens.
    expect(css).toContain("@media (max-width: 768px)");
    expect(css).toContain(".spedn-main {");
    expect(css).toContain("flex-direction: column");
    expect(css).toContain("100dvh");
  });

  it("keeps the desktop 240px sidebar width in the static CSS", () => {
    const css = fs.readFileSync(
      path.join(__dirname, "..", "style.css"),
      "utf8",
    );
    expect(css).toContain("width: 240px");
  });
});