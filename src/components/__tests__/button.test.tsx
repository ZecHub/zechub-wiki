import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button/Button";

describe("Button", () => {
  const user = userEvent.setup();

  it("calls onClick prop when clicked", async () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick} text="Export (PNG)" />);

    await user.click(screen.getByText("Export (PNG)"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
