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

async function chooseYear(option: string) {
  fireEvent.keyDown(screen.getAllByRole("combobox")[1], { key: "ArrowDown" });
  fireEvent.click(
    await screen.findByRole("option", {
      name: (accessibleName) => accessibleName === option,
    }),
  );
}

async function yearOptions() {
  fireEvent.keyDown(screen.getAllByRole("combobox")[1], { key: "ArrowDown" });
  const options = (await screen.findAllByRole("option"))
    .map((option) => option.textContent ?? "")
    .filter((label) => label !== "All Years");
  fireEvent.keyDown(screen.getAllByRole("option")[0], { key: "Escape" });
  return options;
}

function visibleCallLabels() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).queryAllByRole("cell"))
    .filter((cells) => cells.length > 0)
    .map((cells) => cells[0].textContent?.replace("🎉", "").trim());
}

describe("Arborist call archive years", () => {
  it("lists every archived call under one of the Year filter's years", async () => {
    render(<ArboristCallsPage />);
    const years = await yearOptions();
    expect(years.length).toBeGreaterThan(0);

    const listed = new Set<string | undefined>();
    for (const year of years) {
      await chooseYear(year);
      visibleCallLabels().forEach((label) => listed.add(label));
    }

    const unlisted = arboristCalls
      .map((call) => `#${call.id}`)
      .filter((label) => !listed.has(label));
    expect(unlisted).toEqual([]);
  });

  it("shows calls #124 and #125 under 2026", async () => {
    render(<ArboristCallsPage />);
    await chooseYear("2026");

    expect(visibleCallLabels()).toEqual(
      expect.arrayContaining(["#124", "#125"]),
    );
  });
});
