import { fireEvent, render, screen, within } from "@testing-library/react";
import VideoCarousel from "./VideoCarousel";

jest.mock("@/components/LiteYouTube", () => ({
  __esModule: true,
  default: ({ videoId }: { videoId: string }) => <div data-testid="player">{videoId}</div>,
}));

const videos = [
  { id: "O16Szrjy35Q", title: "Arborist Call 11-12-2026" },
  { id: "3FKbc3N41Zw", title: "Arborist Call 10-15-2026" },
];
const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ videos }),
  });
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

it("exposes recording controls as native buttons inside a list", async () => {
  render(<VideoCarousel list="playlist" compact="true" />);
  const recording = await screen.findByRole("button", { name: videos[0].title });
  const items = within(screen.getByRole("list")).getAllByRole("listitem");

  expect(items).toHaveLength(2);
  expect(items[0]).toContainElement(recording);
  expect(recording.tagName).toBe("BUTTON");
  expect(recording).toHaveAttribute("aria-current", "false");
});

it("switches the selected recording and clears it on a repeated click in compact mode", async () => {
  render(<VideoCarousel list="playlist" compact="true" />);
  const first = await screen.findByRole("button", { name: videos[0].title });
  const second = screen.getByRole("button", { name: videos[1].title });

  fireEvent.click(first);
  expect(screen.getByTestId("player")).toHaveTextContent(videos[0].id);
  expect(first).toHaveAttribute("aria-current", "true");
  fireEvent.click(second);
  expect(screen.getByTestId("player")).toHaveTextContent(videos[1].id);
  expect(first).toHaveAttribute("aria-current", "false");
  expect(second).toHaveAttribute("aria-current", "true");
  fireEvent.click(second);
  expect(screen.queryByTestId("player")).not.toBeInTheDocument();
  expect(second).toHaveAttribute("aria-current", "false");
});
