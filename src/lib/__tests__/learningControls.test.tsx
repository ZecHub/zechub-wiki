import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RangeSlider from "@/components/RangeSlider";
import { QuizCard } from "@/components/visualizer/QuizModule";
import ZecToZatsConverter from "@/components/Converter/ZecToZatsConverter";

jest.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({ t: {} }),
}));

// Use the real animation runtime; omit icons and the unused full quiz UI.
jest.mock("lucide-react", () => ({
  CheckCircle2: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
  HelpCircle: () => null,
  X: () => null,
  XCircle: () => null,
}), { virtual: true });
jest.mock("@/components/UI/shadcn/button", () => ({ Button: () => null }));
jest.mock("@/components/UI/shadcn/progress", () => ({ Progress: () => null }));

describe("QuizCard", () => {
  it.each(["{Enter}", " "])("opens from the keyboard with %j", async (key) => {
    const user = userEvent.setup();
    const onOpen = jest.fn();
    render(<QuizCard title="Beginner Quiz" onOpen={onOpen} />);

    const button = screen.getByRole("button", { name: "Beginner Quiz" });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard(key);

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("opens once when the quiz button is clicked", async () => {
    const user = userEvent.setup();
    const onOpen = jest.fn();
    render(<QuizCard title="Beginner Quiz" onOpen={onOpen} />);

    await user.click(screen.getByRole("button", { name: "Beginner Quiz" }));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("preserves the default caption and an explicitly supplied caption", () => {
    const { rerender } = render(
      <QuizCard title="Beginner Quiz" onOpen={jest.fn()} />,
    );
    const defaultCaption = "Test your knowledge with a short quiz. Click to open.";
    expect(screen.getByText(defaultCaption)).toBeInTheDocument();

    rerender(
      <QuizCard
        title="Beginner Quiz"
        description="Review the latest lesson before continuing."
        onOpen={jest.fn()}
      />,
    );

    expect(
      screen.getByText("Review the latest lesson before continuing."),
    ).toBeInTheDocument();
    expect(screen.queryByText(defaultCaption)).not.toBeInTheDocument();
  });
});

describe("RangeSlider", () => {
  it("gives the start and end controls distinct accessible labels", () => {
    render(
      <>
        <RangeSlider
          label="Start Height"
          value={120}
          min={100}
          max={300}
          onChange={jest.fn()}
        />
        <RangeSlider
          label="End Height"
          value={280}
          min={100}
          max={300}
          onChange={jest.fn()}
        />
      </>,
    );

    const start = screen.getByRole("slider", { name: /^Start Height/ });
    const end = screen.getByRole("slider", { name: /^End Height/ });
    expect(start).not.toBe(end);
    expect(screen.getByLabelText(/^Start Height/)).toBe(start);
    expect(screen.getByLabelText(/^End Height/)).toBe(end);
    expect(start).toHaveValue("120");
    expect(end).toHaveValue("280");
  });

  it("preserves bounds, controlled values and numeric change callbacks", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <RangeSlider value={160} min={100} max={300} step={20} onChange={onChange} />,
    );
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "100");
    expect(slider).toHaveAttribute("max", "300");
    expect(slider).toHaveAttribute("step", "20");
    expect(slider).toHaveValue("160");

    fireEvent.change(slider, { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(200);

    rerender(
      <RangeSlider value={200} min={100} max={300} onChange={onChange} />,
    );
    expect(slider).toHaveValue("200");
    expect(slider).toHaveAttribute("step", "1");
  });
});

describe("ZecToZatsConverter", () => {
  it("names each input by its unit and focuses it when its label is clicked", async () => {
    const user = userEvent.setup();
    render(<ZecToZatsConverter />);

    const zec = screen.getByRole("textbox", { name: "ZEC" });
    const zats = screen.getByRole("textbox", { name: "Zats" });
    expect(zec).not.toBe(zats);

    await user.click(screen.getByText("ZEC", { selector: "label" }));
    expect(zec).toHaveFocus();
    await user.click(screen.getByText("Zats", { selector: "label" }));
    expect(zats).toHaveFocus();
  });

  it("preserves conversion and keeps labels attached to the correct inputs after swapping", async () => {
    const user = userEvent.setup();
    render(<ZecToZatsConverter />);

    const top = screen.getByRole("textbox", { name: "ZEC" });
    const bottom = screen.getByRole("textbox", { name: "Zats" });
    await user.clear(top);
    await user.type(top, "1.25");
    expect(top).toHaveValue("1.25");
    expect(bottom).toHaveValue("125,000,000");

    await user.click(screen.getByRole("button", { name: "Swap units" }));

    expect(screen.getByRole("textbox", { name: "Zats" })).toBe(top);
    expect(screen.getByRole("textbox", { name: "ZEC" })).toBe(bottom);
    expect(top).toHaveValue("125,000,000");
    expect(bottom).toHaveValue("1.25");
    await user.click(screen.getByText("ZEC", { selector: "label" }));
    expect(bottom).toHaveFocus();
    await user.click(screen.getByText("Zats", { selector: "label" }));
    expect(top).toHaveFocus();
  });
});
