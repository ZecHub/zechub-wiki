import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "../Home/Home";
import VideoStrip from "../Home/VideoStrip";
import ZcashStats from "../Home/ZcashStats";
import en from "../../../dictionaries/en.json";

let language = { locale: "en", t: { homeLanding: en.homeLanding } };
jest.mock("@/context/LanguageContext", () => ({ useLanguage: () => language }));
jest.mock("@/hooks/useDarkModeContext", () => ({ useDarkModeContext: () => ({ dark: false }) }));
jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => <a href={href} {...props}>{children}</a>,
}));
jest.mock("next/image", () => ({ __esModule: true, default: ({ unoptimized, priority, ...props }: React.ComponentProps<"img"> & { unoptimized?: boolean; priority?: boolean }) => <img {...props} /> }));

beforeEach(() => {
  language = { locale: "en", t: { homeLanding: en.homeLanding } };
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: true }) });
  class Observer {
    constructor(private callback: IntersectionObserverCallback) {}
    observe() { this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    disconnect() {}
  }
  global.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
});

test("the homepage uses translated section, card, link, and CTA copy without changing destinations", () => {
  language = { locale: "fr", t: { homeLanding: {
    ...en.homeLanding,
    hero: { ...en.homeLanding.hero, tagline: "Apprendre Zcash ensemble" },
    featured: { ...en.homeLanding.featured, wallet: { ...en.homeLanding.featured.wallet, title: "Choisir un portefeuille", links: { ...en.homeLanding.featured.wallet.links, first: "Tous les portefeuilles" } } },
    groups: { ...en.homeLanding.groups, deeper: { ...en.homeLanding.groups.deeper, title: "Approfondir" } },
    involved: { ...en.homeLanding.involved, contribute: { ...en.homeLanding.involved.contribute, support: "Soutenir le projet" } },
  } } };
  render(<Home />);
  expect(screen.getByText("Apprendre Zcash ensemble")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Choisir un portefeuille" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Approfondir" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Tous les portefeuilles" })).toHaveAttribute("href", "/wallets");
  expect(screen.getByRole("link", { name: "Soutenir le projet" })).toHaveAttribute("href", "/donation");
});

test("video controls localize labels and keep original video titles", () => {
  language = { locale: "fr", t: { homeLanding: {
    ...en.homeLanding,
    videos: { ...en.homeLanding.videos, title: "Regarder", step: "Étape {number}", play: "Lire {title}", previous: "Vidéos précédentes", next: "Vidéos suivantes" },
  } } };
  render(<VideoStrip />);
  expect(screen.getByRole("heading", { name: "Regarder" })).toBeInTheDocument();
  expect(screen.getByText("Étape 1")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Lire What is Zcash?" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Vidéos précédentes" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Vidéos suivantes" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Lire What is Zcash?" }));
  expect(screen.getByTitle("What is Zcash?")).toHaveAttribute("src", expect.stringContaining("J1Nr1VL5dGU"));
});

test("stats use locale-aware numbers and translated percentage captions/aria labels", async () => {
  language = { locale: "de", t: { homeLanding: {
    ...en.homeLanding,
    stats: { ...en.homeLanding.stats, circulation: "Umlaufmenge", maxSupply: "{percentage}% des Maximums", maxSupplyAria: "{percentage}% des maximalen Angebots" },
  } } };
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { circulation: 1234567, shielded_value_zec: 500000, blocks: 3000000 } }) });
  try {
    render(<ZcashStats />);
    await waitFor(() => expect(screen.getByText("Umlaufmenge")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/1\.234\.567/)).toBeInTheDocument());
    expect(screen.getByText("5,9% des Maximums")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "5,9% des maximalen Angebots" })).toBeInTheDocument();
  } finally {
    global.fetch = originalFetch;
  }
});
