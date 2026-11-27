import { fireEvent, render, screen } from "@testing-library/react";
import ScrollableTable from "./ScrollableTable";

function renderWideTable(direction: "ltr" | "rtl") {
  render(
    <div dir={direction}>
      <ScrollableTable>
        <table>
          <tbody>
            <tr><td>Network upgrade</td><td>Protocol version</td></tr>
          </tbody>
        </table>
      </ScrollableTable>
    </div>,
  );
  const rail = screen.getByRole("table").parentElement!;
  Object.defineProperties(rail, {
    clientWidth: { value: 200 },
    scrollWidth: { value: 500 },
  });
  return rail;
}

it.each([
  ["ltr", 300],
  ["rtl", -300],
] as const)("hides the %s hint only at the end of the table", (dir, end) => {
  const rail = renderWideTable(dir);
  fireEvent.scroll(rail, { target: { scrollLeft: 0 } });
  expect(screen.getByText(/Swipe sideways/)).toBeVisible();

  fireEvent.scroll(rail, { target: { scrollLeft: end / 2 } });
  expect(screen.getByText(/Swipe sideways/)).toBeVisible();

  fireEvent.scroll(rail, { target: { scrollLeft: end } });
  expect(screen.queryByText(/Swipe sideways/)).not.toBeInTheDocument();

  fireEvent.scroll(rail, { target: { scrollLeft: 0 } });
  expect(screen.getByText(/Swipe sideways/)).toBeVisible();
});
