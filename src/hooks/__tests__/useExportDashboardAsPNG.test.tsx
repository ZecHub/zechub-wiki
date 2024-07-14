import { act, renderHook } from "@testing-library/react-hooks";
import useExportDashboardAsPNG, { PoolsType } from "../useExportDashboardAsPNG";

describe("useExportDashboardAsPNG", () => {
  it("should handle saving the chart as PNG correctly", async () => {
    const { result } = renderHook(() => useExportDashboardAsPNG());

    // Mocking the divChartRef current value to simulate having a DOM node
    Object.defineProperty(result.current.divChartRef, "current", {
      value: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
      writable: true,
    });

    // Simulate calling handleSaveToPng with different pool types
    await act(async () => {
      await result.current.handleSaveToPng(PoolsType.sprout, {
        sproutSupply: { timestamp: "2023-01-01T00:00:00Z", supply: 12345 },
      });
    });

    // Check if the expected child was appended
    expect(
      result.current.divChartRef.current!.appendChild
    ).toHaveBeenCalledWith(expect.anything());
  });
});
