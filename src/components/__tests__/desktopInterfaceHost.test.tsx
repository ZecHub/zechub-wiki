import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesktopInterfaceHost from "@/components/DesktopInterfaceHost";
import { INTERFACE_KEY, applyInterface } from "@/lib/interfaces";

const mockSetTheme = jest.fn();

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: mockSetTheme }),
}));

describe("Desktop interface host", () => {
  const user = userEvent.setup();

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

  it("keeps the locale and exits back to Classic", async () => {
    applyInterface("desktop");
    render(<DesktopInterfaceHost locale="fr" />);

    const frame = await screen.findByTitle("ZecHub Desktop");
    const src = frame.getAttribute("src") ?? "";
    expect(src).toMatch(/^https:\/\/[^/]+\/fr\?/);
    expect(src).toContain("theme=vault");

    await user.click(screen.getByRole("button", { name: "Exit desktop" }));

    await waitFor(() => {
      expect(screen.queryByTitle("ZecHub Desktop")).toBeNull();
    });
    expect(document.documentElement.hasAttribute("data-interface")).toBe(false);
    expect(localStorage.getItem(INTERFACE_KEY)).toBe("classic");
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
