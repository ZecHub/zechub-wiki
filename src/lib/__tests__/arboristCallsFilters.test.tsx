import { fireEvent, render, screen, within } from "@testing-library/react";
import { arboristCalls } from "@/constants/arboristCalls";
import ArboristCallsPage from "@/app/[locale]/arborist-calls/ArboristCallsPage";

jest.mock("@/lib/helpers", () => ({ genMetadata: () => ({}) }));

const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

afterAll(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView;
});

async function chooseFilter(comboboxIndex: number, option: string) {
  fireEvent.keyDown(screen.getAllByRole("combobox")[comboboxIndex], {
    key: "ArrowDown",
  });
  fireEvent.click(
    await screen.findByRole("option", { name: option, exact: true }),
  );
}

function visibleCallLabels() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).queryAllByRole("cell"))
    .filter((cells) => cells.length > 0)
    .map((cells) => cells[0].textContent?.replace("🎉", "").trim());
}

function archivedYears() {
  return [
    ...new Set(
      arboristCalls
        .map((call) => call.date.slice(-4))
        .filter((year) => /^\d{4}$/.test(year)),
    ),
  ].sort((a, b) => Number(b) - Number(a));
}

describe("Arborist call archive filters", () => {
  it("offers every archived year in newest-first order", async () => {
    render(<ArboristCallsPage />);
    fireEvent.keyDown(screen.getAllByRole("combobox")[1], { key: "ArrowDown" });

    const options = await screen.findAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual([
      "All Years",
      ...archivedYears(),
    ]);
  });

  it.each(archivedYears())(
    "shows exactly the archived calls from %s",
    async (year) => {
      render(<ArboristCallsPage />);
      await chooseFilter(1, year);

      const expected = arboristCalls.filter(
        (call) => call.date.slice(-4) === year,
      );
      expect(expected.length).toBeGreaterThan(0);
      expect(visibleCallLabels()).toEqual(expected.map((call) => `#${call.id}`));
      expect(
        screen.getByText(
          `Showing ${expected.length} of ${arboristCalls.length} calls`,
        ),
      ).toBeVisible();
    },
  );

  it("combines year, search and status filters and restores the full archive", async () => {
    const years = archivedYears();
    const sampleYear = years.includes("2023") ? "2023" : years[0];

    render(<ArboristCallsPage />);
    await chooseFilter(1, sampleYear);
    const example = arboristCalls.find(
      (call) => call.date.slice(-4) === sampleYear,
    )!;
    fireEvent.change(screen.getByPlaceholderText("Call # or date..."), {
      target: { value: example.date },
    });
    await chooseFilter(0, "Completed");
    expect(visibleCallLabels()).toEqual([`#${example.id}`]);

    await chooseFilter(0, "Upcoming");
    expect(
      screen.getByText(`Showing 0 of ${arboristCalls.length} calls`),
    ).toBeVisible();
    expect(screen.getAllByRole("row")).toHaveLength(1);

    await chooseFilter(0, "All Status");
    await chooseFilter(1, "All Years");
    fireEvent.change(screen.getByPlaceholderText("Call # or date..."), {
      target: { value: "" },
    });
    expect(visibleCallLabels()).toEqual(
      arboristCalls.map((call) => `#${call.id}`),
    );
  });
});
