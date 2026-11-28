import { act, fireEvent, render, screen } from "@testing-library/react";
import { GovernanceVisualizer } from "../Governance";
import { MiningHaloVisualizer } from "../MiningHalo";
import { PrivacyUseCasesVisualizer } from "../PrivacyUsecases";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

function advanceStage() {
  act(() => jest.advanceTimersByTime(10_000));
}

describe.each([
  ["Governance", GovernanceVisualizer],
  ["Mining Halo", MiningHaloVisualizer],
  ["Privacy Use Cases", PrivacyUseCasesVisualizer],
] as const)("%s autoplay", (_name, Visualizer) => {
  it("continues through more than one stage after Play is pressed", () => {
    render(<Visualizer />);
    fireEvent.click(screen.getByRole("button", { name: "Play visualizer" }));

    advanceStage();
    expect(screen.getByText(/^2 \/ \d+$/)).toBeInTheDocument();
    advanceStage();
    expect(screen.getByText(/^3 \/ \d+$/)).toBeInTheDocument();
  });
});

it("cancels the old timer when skipping and stays paused or restarted", () => {
  render(<PrivacyUseCasesVisualizer autoStart />);
  act(() => jest.advanceTimersByTime(7_000));
  fireEvent.click(screen.getByRole("button", { name: "Next step" }));
  act(() => jest.advanceTimersByTime(3_000));
  expect(screen.getByText("2 / 5")).toBeInTheDocument();

  act(() => jest.advanceTimersByTime(7_000));
  expect(screen.getByText("3 / 5")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Pause visualizer" }));
  advanceStage();
  expect(screen.getByText("3 / 5")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Play visualizer" }));
  fireEvent.click(screen.getByRole("button", { name: "Restart visualizer" }));
  advanceStage();
  expect(screen.getByText("1 / 5")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play visualizer" })).toBeInTheDocument();
});

it("finishes on the last stage and calls the completion callback once", () => {
  const onComplete = jest.fn();
  render(<PrivacyUseCasesVisualizer autoStart onComplete={onComplete} />);
  for (let step = 2; step <= 5; step++) {
    advanceStage();
    expect(screen.getByText(`${step} / 5`)).toBeInTheDocument();
  }

  advanceStage();
  expect(screen.getByRole("button", { name: "Play visualizer" })).toBeInTheDocument();
  advanceStage();
  expect(screen.getByText("5 / 5")).toBeInTheDocument();
  expect(onComplete).toHaveBeenCalledTimes(1);
});
