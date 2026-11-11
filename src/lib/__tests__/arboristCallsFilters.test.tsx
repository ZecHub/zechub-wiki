import { fireEvent, render, screen } from "@testing-library/react";
import ArboristCallsPage from "@/app/[locale]/arborist-calls/ArboristCallsPage";
import { buildArboristArchive } from "@/lib/arboristArchive";

// The carousel loads the playlist from the network; the archive does not need it.
jest.mock("@/components/MdxComponents/VideoCarousel", () => ({
  __esModule: true,
  default: () => null,
}));

const archive = buildArboristArchive();
const years = [
  ...new Set(archive.map((e) => e.date?.slice(0, 4)).filter(Boolean) as string[]),
]
  .sort()
  .reverse();

const showing = (shown: number) =>
  screen.getByText(`Showing ${shown} of ${archive.length}`);

describe("Arborist call archive filters", () => {
  it("offers every archived year in newest-first order", () => {
    render(<ArboristCallsPage />);
    const options = screen
      .getAllByRole("option")
      .map((option) => option.textContent);
    expect(options).toEqual(["All years", ...years]);
  });

  it.each(years)("shows exactly the archive entries from %s", (year) => {
    render(<ArboristCallsPage />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: year } });

    const expected = archive.filter((e) => e.date?.startsWith(year));
    expect(expected.length).toBeGreaterThan(0);
    expect(showing(expected.length)).toBeVisible();
  });

  it("finds a call by number and restores the full archive", () => {
    render(<ArboristCallsPage />);
    const search = screen.getByPlaceholderText("Call number, date or title");

    fireEvent.change(search, { target: { value: "#134" } });
    expect(showing(archive.filter((e) => e.label === "#134").length)).toBeVisible();

    fireEvent.change(search, { target: { value: "no such call" } });
    expect(screen.getByText("Nothing matches this search.")).toBeVisible();

    fireEvent.change(search, { target: { value: "" } });
    expect(showing(archive.length)).toBeVisible();
  });
});
