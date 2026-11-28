import { fireEvent, render, screen } from "@testing-library/react";
import ResearchArticleAside from "../ResearchArticleAside";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

const shareUrl = "https://zechub.wiki/research/what-25-second-blocks-actually-change";
const clipboard = jest.fn();
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

beforeEach(() => {
  clipboard.mockReset();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: clipboard },
  });
});

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
});

it("offers the canonical link for manual copying when permission is denied", async () => {
  clipboard.mockRejectedValueOnce(new DOMException("Write denied", "NotAllowedError"));
  render(<ResearchArticleAside title="Migration" shareUrl={shareUrl} />);

  fireEvent.click(screen.getByRole("button", { name: "Copy page link for Discord" }));

  const field = await screen.findByRole("textbox", { name: "Article link" });
  expect(field).toHaveAttribute("readonly");
  expect(field).toHaveValue(shareUrl);
  expect(screen.getByRole("status")).toHaveTextContent("Copy the article link manually.");
});

it("copies the article link and confirms a successful copy", async () => {
  clipboard.mockResolvedValueOnce(undefined);
  render(<ResearchArticleAside title="Migration" shareUrl={shareUrl} />);

  fireEvent.click(screen.getByRole("button", { name: "Copy page link for Discord" }));

  expect(await screen.findByText("Link copied to clipboard!")).toBeInTheDocument();
  expect(clipboard).toHaveBeenCalledWith(shareUrl);
  expect(screen.queryByRole("textbox", { name: "Article link" })).not.toBeInTheDocument();
});
