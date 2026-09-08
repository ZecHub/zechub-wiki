import { fireEvent, render, screen, within } from "@testing-library/react";
import { arboristCalls } from "@/constants/arboristCalls";
import ArboristCallsPage from "@/app/[locale]/aborist-calls/ArboristCallsPage";

jest.mock("@/lib/helpers", () => ({ genMetadata: () => ({}) }));

const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

afterAll(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView;
});

async function chooseFilter(index: number, option: string) {
  fireEvent.keyDown(screen.getAllByRole("combobox")[index], {
    key: "ArrowDown",
  });
  fireEvent.click(await screen.findByRole("option", { name: option, exact: true }));
}

function visibleCallLabels() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => {
      return within(row).getAllByRole("cell")[0].textContent?.replace("🎉", "").trim();
    });
}

describe("Arborist call archive filters", () => {
  it("offers every archived year in newest-first order", async () => {
    render(<ArboristCallsPage />);
    fireEvent.keyDown(screen.getAllByRole("combobox")[1], { key: "ArrowDown" });

    const options = await screen.findAllByRole("option");
    const years = [
      ...new Set(arboristCalls.map((call) => new Date(call.date).getFullYear())),
    ]
      .sort((a, b) => b - a)
      .map(String);
    expect(options.map((option) => option.textContent)).toEqual([
      "All Years",
      ...years,
    ]);
  });

  it.each([2020, 2021, 2022, 2023, 2024, 2025])(
    "shows exactly the archived calls from %i",
    async (year) => {
      render(<ArboristCallsPage />);
      await chooseFilter(1, String(year));

      const expected = arboristCalls.filter(
        (call) => new Date(call.date).getFullYear() === year
      );
      expect(expected.length).toBeGreaterThan(0);
      expect(visibleCallLabels()).toEqual(expected.map((call) => `#${call.id}`));
      expect(
        screen.getByText(`Showing ${expected.length} of ${arboristCalls.length} calls`)
      ).toBeVisible();
    }
  );

  it("combines year, search and status filters and restores the full archive", async () => {
    render(<ArboristCallsPage />);
    await chooseFilter(1, "2023");
    const example = arboristCalls.find(
      (call) => new Date(call.date).getFullYear() === 2023
    )!;
    fireEvent.change(screen.getByPlaceholderText("Call # or date..."), {
      target: { value: example.date },
    });
    await chooseFilter(0, "Completed");
    expect(visibleCallLabels()).toEqual([`#${example.id}`]);

    await chooseFilter(0, "Upcoming");
    expect(screen.getByText(`Showing 0 of ${arboristCalls.length} calls`)).toBeVisible();
    expect(screen.getAllByRole("row")).toHaveLength(1);

    await chooseFilter(0, "All Status");
    await chooseFilter(1, "All Years");
    fireEvent.change(screen.getByPlaceholderText("Call # or date..."), {
      target: { value: "" },
    });
    expect(visibleCallLabels()).toEqual(arboristCalls.map((call) => `#${call.id}`));
  });
});
