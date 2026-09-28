import { useCallback, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LANGUAGES, useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "../LanguageSwitcher";

const mockSetLocale = jest.fn();
const mockReplace = jest.fn();

jest.mock("@/context/LanguageContext", () => ({
  LANGUAGES: [
    { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
    { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
    { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
    { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  ],
  useLanguage: jest.fn(),
}));

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/dashboard",
}));

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "es", "fr", "ja"] },
}));

// Keep locale changes real so selection exercises the trigger's locale update
// and any resulting remount, rather than succeeding with a frozen mock value.
function useMockLanguage() {
  const [locale, setLocaleState] = useState("es");
  const setLocale = useCallback((code: string) => {
    mockSetLocale(code);
    setLocaleState(code);
  }, []);

  return {
    locale,
    setLocale,
    currentLanguage: LANGUAGES.find((language) => language.code === locale)!,
    t: {},
  };
}

function renderPicker() {
  return render(
    <>
      <button type="button">Before picker</button>
      <LanguageSwitcher />
      <button type="button">After picker</button>
    </>,
  );
}

function trigger() {
  return screen.getByRole("button", { name: "Select language" });
}

function option(name: RegExp) {
  return screen.getByRole("option", { name });
}

function expectNoSelection() {
  expect(mockSetLocale).not.toHaveBeenCalled();
  expect(mockReplace).not.toHaveBeenCalled();
}

describe("LanguageSwitcher keyboard and pointer behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useLanguage).mockImplementation(useMockLanguage);
  });

  it("starts closed without taking focus from another control", () => {
    render(<button type="button">Already focused</button>);
    const outside = screen.getByRole("button", { name: "Already focused" });
    outside.focus();

    renderPicker();

    expect(outside).toHaveFocus();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveTextContent("Español");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expectNoSelection();
  });

  it("opens on click with focus on the current, non-first language", async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.click(trigger());

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox", { name: "Language options" })).toBeVisible();
    expect(option(/Español/)).toHaveFocus();
    expect(option(/Español/)).toHaveAttribute("aria-selected", "true");
    expect(option(/English/)).toHaveAttribute("aria-selected", "false");
    expectNoSelection();
  });

  it.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
    ["ArrowDown", "{ArrowDown}"],
    ["ArrowUp", "{ArrowUp}"],
  ])("opens with %s and focuses the current language", async (_name, key) => {
    const user = userEvent.setup();
    renderPicker();
    await user.tab();
    await user.tab();
    expect(trigger()).toHaveFocus();

    await user.keyboard(key);

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(option(/Español/)).toHaveFocus();
    expectNoSelection();
  });

  it("moves through languages with arrows, Home and End without selecting", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.keyboard("{ArrowDown}");
    expect(option(/Français/)).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(option(/Español/)).toHaveFocus();
    await user.keyboard("{Home}");
    expect(option(/English/)).toHaveFocus();
    await user.keyboard("{End}");
    expect(option(/日本語/)).toHaveFocus();

    expect(option(/Español/)).toHaveAttribute("aria-selected", "true");
    expect(option(/日本語/)).toHaveAttribute("aria-selected", "false");
    expectNoSelection();
  });

  it.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
  ])("selects exactly once with %s and restores focus after locale changes", async (_name, key) => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    await user.keyboard("{ArrowDown}");
    expect(option(/Français/)).toHaveFocus();

    await user.keyboard(key);

    expect(mockSetLocale).toHaveBeenCalledTimes(1);
    expect(mockSetLocale).toHaveBeenCalledWith("fr");
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/dashboard", { locale: "fr" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveTextContent("Français");
    await waitFor(() => expect(trigger()).toHaveFocus());

    await user.click(trigger());
    expect(option(/Français/)).toHaveFocus();
    expect(option(/Français/)).toHaveAttribute("aria-selected", "true");
    expect(mockSetLocale).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it.each(["option", "trigger"])("dismisses with Escape from the %s without changing language", async (origin) => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    if (origin === "trigger") trigger().focus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveFocus();
    expect(trigger()).toHaveTextContent("Español");
    expectNoSelection();
  });

  it("lets Tab leave the entire picker for the following control", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.tab();

    expect(screen.getByRole("button", { name: "After picker" })).toHaveFocus();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expectNoSelection();
  });

  it("lets Shift+Tab leave the entire picker for the preceding control", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.tab({ shift: true });

    expect(screen.getByRole("button", { name: "Before picker" })).toHaveFocus();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expectNoSelection();
  });

  it("preserves pointer selection and the current pathname", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.click(option(/English/));

    expect(mockSetLocale).toHaveBeenCalledTimes(1);
    expect(mockSetLocale).toHaveBeenCalledWith("en");
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/dashboard", { locale: "en" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveTextContent("English");
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it("dismisses an outside click without stealing the clicked control's focus", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    const outside = screen.getByRole("button", { name: "After picker" });

    await user.click(outside);

    expect(outside).toHaveFocus();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expectNoSelection();
  });
});
