import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorThemePicker from "@/components/ColorThemePicker";
import { INTERFACE_KEY } from "@/lib/interfaces";

describe("Appearance menu: Interface section", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-interface");
  });

  it("shows Interface above Mode and Color theme", async () => {
    render(<ColorThemePicker withMode />);
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    const dialog = screen.getByRole("dialog", { name: "Appearance" });
    const text = dialog.textContent ?? "";
    expect(text.indexOf("Interface")).toBeGreaterThanOrEqual(0);
    expect(text.indexOf("Interface")).toBeLessThan(text.indexOf("Mode"));
    expect(text.indexOf("Mode")).toBeLessThan(text.indexOf("Color theme"));
  });

  it("applies and saves Reader, then goes back to Classic", async () => {
    render(<ColorThemePicker withMode />);
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    const dialog = screen.getByRole("dialog", { name: "Appearance" });

    const reader = within(dialog).getByRole("button", { name: /^Reader/ });
    const classic = within(dialog).getByRole("button", { name: /^Classic/ });
    expect(classic).toHaveAttribute("aria-pressed", "true");

    await user.click(reader);
    expect(document.documentElement.getAttribute("data-interface")).toBe("reader");
    expect(localStorage.getItem(INTERFACE_KEY)).toBe("reader");
    expect(reader).toHaveAttribute("aria-pressed", "true");
    expect(classic).toHaveAttribute("aria-pressed", "false");

    await user.click(classic);
    expect(document.documentElement.hasAttribute("data-interface")).toBe(false);
    expect(localStorage.getItem(INTERFACE_KEY)).toBe("classic");
  });

  it("keeps the colour theme when the interface changes", async () => {
    render(<ColorThemePicker withMode />);
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    const dialog = screen.getByRole("dialog", { name: "Appearance" });
    await user.click(within(dialog).getByRole("button", { name: /^Sunset/ }));
    await user.click(within(dialog).getByRole("button", { name: /^Reader/ }));
    expect(document.documentElement.getAttribute("data-color-theme")).toBe("sunset");
    expect(document.documentElement.getAttribute("data-interface")).toBe("reader");
  });

  it("also offers interfaces in the compact menu without the mode switch", async () => {
    render(<ColorThemePicker />);
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    const dialog = screen.getByRole("dialog", { name: "Appearance" });
    expect(within(dialog).getByRole("button", { name: /^Reader/ })).toBeInTheDocument();
    expect(dialog.textContent).not.toContain("Mode");
  });

  it("restores a saved interface as the selected option", async () => {
    localStorage.setItem(INTERFACE_KEY, "reader");
    render(<ColorThemePicker withMode />);
    await user.click(screen.getByRole("button", { name: "Appearance" }));
    const dialog = screen.getByRole("dialog", { name: "Appearance" });
    expect(within(dialog).getByRole("button", { name: /^Reader/ })).toHaveAttribute("aria-pressed", "true");
  });
});
