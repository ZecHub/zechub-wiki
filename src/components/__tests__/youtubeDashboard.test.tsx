import { fireEvent, render, screen } from "@testing-library/react";
import Dashboard from "../Charts";

// Only the YouTube tab is under test; stub the other dashboards and the
// locale-aware navigation helpers.
jest.mock("@/i18n/navigation", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace: jest.fn() }),
}));
jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: undefined }),
}));
jest.mock("next/dynamic", () => () => () => null);
jest.mock("@/hooks/useExportDashboardAsPNG", () => () => ({
  divChartRef: { current: null },
  handleSaveToPng: jest.fn(),
}));
jest.mock("@/components/LiteYouTube", () => () => null);
jest.mock("../Charts/Namada/NamadaChart", () => () => null);
jest.mock("../Charts/Penumbra/PenumbraChart", () => () => null);
jest.mock("../Charts/Zcash/ZcashChart", () => () => null);
jest.mock("@/components/Proposals", () => ({ ProposalsList: () => null }));
jest.mock("@/components/CodePulse", () => () => null);

// Newest videos first, as in public/data/youtube/ZecHubByDate.json.
const latest = [
  { title: "ZecHub x Unstoppable Wallet | X Space", video_id: "a", views: 33 },
  {
    title: "Zcash Retroactive Funding Round | X Space",
    video_id: "b",
    views: 100,
  },
  {
    title: "Harry Halpin on Nym, Zcash & Network-Level Privacy",
    video_id: "c",
    views: 543,
  },
];
const byViews = [...latest].sort((a, b) => b.views - a.views);

// The video list renders titles in a <span>; the "Most Viewed" card uses a <p>.
const barWidth = (title: string) => {
  const row = screen.getByText(title, { selector: "span" }).parentElement!;
  const bar = row.nextElementSibling!.firstElementChild as HTMLElement;
  return bar.style.width;
};

describe("YouTube dashboard view bars", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    window.history.pushState({}, "", "/dashboard?tab=youtube");
    global.fetch = jest.fn(async (input) => {
      const videos = String(input).includes("ByDate") ? latest : byViews;
      return { json: async () => ({ channelIcon: "", videos }) };
    }) as jest.Mock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    window.history.pushState({}, "", "/");
  });

  it("scales the latest videos against the most viewed one", async () => {
    render(<Dashboard zipsData={{} as any} />);

    fireEvent.click(
      await screen.findByRole(
        "button",
        { name: "Latest 15 Videos" },
        { timeout: 3000 },
      ),
    );

    // 543 views is the longest bar; the newest video (33 views) is not.
    expect(barWidth(latest[2].title)).toBe("100%");
    expect(barWidth(latest[1].title)).toBe(`${(100 / 543) * 100}%`);
    expect(barWidth(latest[0].title)).toBe("8%"); // minimum bar width
  });

  it("keeps the top-by-views list scaled to its first entry", async () => {
    render(<Dashboard zipsData={{} as any} />);

    await screen.findByText("Top 15 Videos by Views", {}, { timeout: 3000 });

    expect(barWidth(latest[2].title)).toBe("100%");
    expect(barWidth(latest[1].title)).toBe(`${(100 / 543) * 100}%`);
  });
});
