import { act, renderHook } from "@testing-library/react";
import html2canvas from "html2canvas";
import useExportDashboardAsPNG, { PoolsType } from "../useExportDashboardAsPNG";

jest.mock("html2canvas", () => jest.fn());

const mockHtml2canvas = html2canvas as jest.MockedFunction<typeof html2canvas>;

describe("useExportDashboardAsPNG", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockHtml2canvas.mockReset();
    jest.spyOn(console, "log").mockImplementation(() => undefined);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    jest.spyOn(window, "alert").mockImplementation(() => undefined);
    mockHtml2canvas.mockResolvedValue({
      toDataURL: jest.fn(() => "data:image/png;base64,test"),
    } as unknown as HTMLCanvasElement);
  });

  afterEach(() => {
    document.querySelectorAll("[data-export-test]").forEach((node) => node.remove());
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function attachChart() {
    const chart = document.createElement("div");
    chart.dataset.exportTest = "true";
    document.body.appendChild(chart);
    return chart;
  }

  async function finishDelay(exportPromise: Promise<void>) {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(350);
      await exportPromise;
    });
  }

  it("exports the selected chart as a PNG", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    const chart = attachChart();
    Object.defineProperties(chart, {
      offsetWidth: { value: 640 },
      offsetHeight: { value: 480 },
    });
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    Object.defineProperty(result.current.divChartRef, "current", {
      value: chart,
      writable: true,
    });

    const exportPromise = result.current.handleSaveToPng(PoolsType.sprout);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(350);
      await exportPromise;
    });

    expect(mockHtml2canvas).toHaveBeenCalledWith(
      chart,
      expect.objectContaining({ width: 640, height: 480, scale: 3 }),
    );
    expect(click).toHaveBeenCalledTimes(1);
    expect(click.mock.contexts[0].download).toBe("sprout-zechub-chart.png");
  });

  it("does not export a replacement chart under the previous chart's label", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    result.current.divChartRef.current = attachChart();
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    const exportPromise = result.current.handleSaveToPng("supply");
    result.current.divChartRef.current = attachChart();
    await finishDelay(exportPromise);

    expect(mockHtml2canvas).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("cancels quietly when the chart ref clears during the paint delay", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    result.current.divChartRef.current = attachChart();
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    const exportPromise = result.current.handleSaveToPng("supply");
    result.current.divChartRef.current = null;
    await finishDelay(exportPromise);

    expect(window.alert).not.toHaveBeenCalled();
    expect(mockHtml2canvas).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
  });

  it("does not capture a detached chart even if a stale ref remains", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    const chart = attachChart();
    result.current.divChartRef.current = chart;
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    const exportPromise = result.current.handleSaveToPng("supply");
    chart.remove();
    await finishDelay(exportPromise);

    expect(mockHtml2canvas).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("discards a capture that finishes after the chart selection changes", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    result.current.divChartRef.current = attachChart();
    let resolveCapture!: (canvas: HTMLCanvasElement) => void;
    mockHtml2canvas.mockReturnValue(new Promise((resolve) => { resolveCapture = resolve; }));
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    const exportPromise = result.current.handleSaveToPng("supply");
    await act(async () => { await jest.advanceTimersByTimeAsync(350); });
    expect(mockHtml2canvas).toHaveBeenCalledTimes(1);
    result.current.divChartRef.current = attachChart();
    const toDataURL = jest.fn(() => "data:image/png;base64,test");
    await act(async () => {
      resolveCapture({ toDataURL } as unknown as HTMLCanvasElement);
      await exportPromise;
    });

    expect(toDataURL).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("ignores a capture failure after its chart has been removed", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    result.current.divChartRef.current = attachChart();
    let rejectCapture!: (error: Error) => void;
    mockHtml2canvas.mockReturnValue(new Promise((_, reject) => { rejectCapture = reject; }));
    const exportPromise = result.current.handleSaveToPng("supply");
    await act(async () => { await jest.advanceTimersByTimeAsync(350); });
    result.current.divChartRef.current = null;
    await act(async () => {
      rejectCapture(new Error("Chart removed during capture"));
      await exportPromise;
    });

    expect(window.alert).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("still reports a genuine capture failure for the current chart", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    result.current.divChartRef.current = attachChart();
    mockHtml2canvas.mockRejectedValue(new Error("Capture failed"));
    await finishDelay(result.current.handleSaveToPng("supply"));

    expect(window.alert).toHaveBeenCalledWith("Export failed. Check console (F12) for details.");
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
