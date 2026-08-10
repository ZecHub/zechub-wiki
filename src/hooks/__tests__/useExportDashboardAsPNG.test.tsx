import { act, renderHook } from "@testing-library/react";
import html2canvas from "html2canvas";
import useExportDashboardAsPNG, { PoolsType } from "../useExportDashboardAsPNG";

jest.mock("html2canvas", () => jest.fn());

const mockHtml2canvas = html2canvas as jest.MockedFunction<typeof html2canvas>;

describe("useExportDashboardAsPNG", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, "log").mockImplementation(() => undefined);
    mockHtml2canvas.mockResolvedValue({
      toDataURL: jest.fn(() => "data:image/png;base64,test"),
    } as unknown as HTMLCanvasElement);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("exports the selected chart as a PNG", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());
    const chart = document.createElement("div");
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
  });
});
