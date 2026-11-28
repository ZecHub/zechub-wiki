import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MediaArchivePage from "./MediaArchivePage";
import type { MediaArchiveEntry } from "./types";

jest.mock("@/components/MdxComponents/VideoCarousel", () => ({
  __esModule: true,
  default: () => <button>Playlist recording</button>,
}));

const dedicated: MediaArchiveEntry = {
  key: "dedicated",
  label: "A dedicated call",
  date: "2026-01-15",
  title: "Special call",
  duration: null,
  dedicated: true,
  video: "https://example.com/recording",
  videoId: null,
  notes: "",
  agenda: "",
  twitter: "",
};

function renderArchive({ hasDedicated = true, dir = "ltr" } = {}) {
  render(
    <div dir={dir}>
      <button>Before archive</button>
      <MediaArchivePage
        eyebrow="Protocol development"
        title="Arborist Calls"
        description="Meeting recordings"
        playlistId="playlist"
        carouselLabel="Earlier calls"
        entries={hasDedicated ? [dedicated] : []}
      />
    </div>,
  );
}

it("moves focus with an arrow and activates a tab only on Enter", async () => {
  const user = userEvent.setup();
  renderArchive();
  const previous = screen.getByRole("tab", { name: "Previous calls" });
  const archive = screen.getByRole("tab", { name: "Archive" });
  await user.tab();
  await user.tab();
  expect(previous).toHaveFocus();
  expect(archive).toHaveAttribute("tabindex", "-1");

  await user.keyboard("{ArrowRight}");
  expect(archive).toHaveFocus();
  expect(previous).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel", { name: "Previous calls" })).toBeVisible();

  await user.keyboard("{Enter}");
  expect(archive).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel", { name: "Archive" })).toBeVisible();
});

it("wraps around, supports Home and End, and uses native Space activation", async () => {
  const user = userEvent.setup();
  renderArchive();
  const tabs = within(screen.getByRole("tablist", { name: "Browse calls" }));
  const previous = tabs.getByRole("tab", { name: "Previous calls" });
  const last = tabs.getByRole("tab", { name: "Dedicated editions" });
  await user.click(previous);
  await user.keyboard("{ArrowLeft}");
  expect(last).toHaveFocus();
  await user.keyboard("{ArrowRight}{End}");
  expect(last).toHaveFocus();
  await user.keyboard("{Home}");
  expect(previous).toHaveFocus();
  await user.keyboard("{End} ");
  expect(screen.getByRole("tabpanel", { name: "Dedicated editions" })).toBeVisible();
});

it("returns to the selected tab after leaving an unactivated tab with Tab", async () => {
  const user = userEvent.setup();
  renderArchive({ hasDedicated: false });
  const previous = screen.getByRole("tab", { name: "Previous calls" });
  await user.click(previous);
  await user.keyboard("{End}");
  expect(screen.getByRole("tab", { name: "Archive" })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("tabpanel", { name: "Previous calls" })).toHaveFocus();
  await user.tab({ shift: true });
  expect(previous).toHaveFocus();
  expect(screen.getAllByRole("tab")).toHaveLength(2);
});

it("follows the visual direction of an RTL tab strip", async () => {
  const user = userEvent.setup();
  renderArchive({ dir: "rtl" });
  await user.click(screen.getByRole("tab", { name: "Previous calls" }));
  await user.keyboard("{ArrowLeft}");
  expect(screen.getByRole("tab", { name: "Archive" })).toHaveFocus();
});
