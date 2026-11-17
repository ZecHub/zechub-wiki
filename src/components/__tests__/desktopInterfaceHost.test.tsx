import { render, screen, waitFor } from "@testing-library/react";
import DesktopInterfaceHost from "@/components/DesktopInterfaceHost";
import { INTERFACE_KEY, applyInterface } from "@/lib/interfaces";

const mockSetTheme = jest.fn();

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: mockSetTheme }),
}));

describe("Desktop interface host", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-interface");
    document.body.style.overflow = "";
    mockSetTheme.mockClear();
  });

  it("renders the desktop only when its interface is active", async () => {
    render(<DesktopInterfaceHost locale="en" />);
    expect(screen.queryByTitle("ZecHub Desktop")).toBeNull();

    applyInterface("desktop");

    const frame = await screen.findByTitle("ZecHub Desktop");
    const src = frame.getAttribute("src") ?? "";
    expect(src).toMatch(/^https:\/\/[^/]+\/\?/);
    expect(src).toContain("theme=vault");
    expect(src).toContain("parentOrigin=");
  });

  it("keeps the locale and switches back to Classic when the app asks", async () => {
    applyInterface("desktop");
    render(<DesktopInterfaceHost locale="fr" />);

    const frame = (await screen.findByTitle("ZecHub Desktop")) as HTMLIFrameElement;
    const src = frame.getAttribute("src") ?? "";
    expect(src).toMatch(/^https:\/\/[^/]+\/fr\?/);
    expect(src).toContain("theme=vault");

    window.dispatchEvent(
      new MessageEvent("message", {
        origin: new URL(src).origin,
        source: frame.contentWindow,
        data: { type: "zechub:switch-interface", interface: "classic" },
      }),
    );

    await waitFor(() => {
      expect(screen.queryByTitle("ZecHub Desktop")).toBeNull();
    });
    expect(document.documentElement.hasAttribute("data-interface")).toBe(false);
    expect(localStorage.getItem(INTERFACE_KEY)).toBe("classic");
  });

  it("switches to Reader when the app asks", async () => {
    applyInterface("desktop");
    render(<DesktopInterfaceHost locale="en" />);

    const frame = (await screen.findByTitle("ZecHub Desktop")) as HTMLIFrameElement;
    const src = frame.getAttribute("src") ?? "";

    window.dispatchEvent(
      new MessageEvent("message", {
        origin: new URL(src).origin,
        source: frame.contentWindow,
        data: { type: "zechub:switch-interface", interface: "reader" },
      }),
    );

    await waitFor(() => {
      expect(document.documentElement.getAttribute("data-interface")).toBe("reader");
    });
    expect(localStorage.getItem(INTERFACE_KEY)).toBe("reader");
    expect(screen.queryByTitle("ZecHub Desktop")).toBeNull();
  });

  it("adopts the app theme from a message", async () => {
    applyInterface("desktop");
    render(<DesktopInterfaceHost locale="en" />);

    const frame = (await screen.findByTitle("ZecHub Desktop")) as HTMLIFrameElement;
    const appOrigin = new URL(frame.src).origin;

    window.dispatchEvent(
      new MessageEvent("message", {
        origin: appOrigin,
        source: frame.contentWindow,
        data: { type: "zechub:theme", theme: "paper" },
      }),
    );

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
