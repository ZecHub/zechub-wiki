import { useCallback, useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
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
    { code: "el", label: "Greek", nativeLabel: "Ελληνικά", flag: "🇬🇷" },
  ],
  useLanguage: jest.fn(),
}));

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/dashboard",
}));

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "es", "fr", "ja", "el"] },
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

// The visitor's browser languages drive the "Suggested" group.
function setBrowserLanguages(langs: string[]) {
  Object.defineProperty(window.navigator, "languages", { value: langs, configurable: true });
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

function search() {
  return screen.getByRole("searchbox", { name: "Search languages" });
}

function option(name: RegExp) {
  return screen.getByRole("option", { name });
}

function optionCodes() {
  return screen.getAllByRole("option").map((o) => o.getAttribute("data-code"));
}

function expectNoSelection() {
  expect(mockSetLocale).not.toHaveBeenCalled();
  expect(mockReplace).not.toHaveBeenCalled();
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useLanguage).mockImplementation(useMockLanguage);
    setBrowserLanguages(["en-US", "en"]);
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

  it("opens on click with focus in the search field", async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.click(trigger());

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox", { name: "Language options" })).toBeVisible();
    expect(search()).toHaveFocus();
    expect(option(/Español/)).toHaveAttribute("aria-selected", "true");
    expect(option(/English/)).toHaveAttribute("aria-selected", "false");
    expectNoSelection();
  });

  it.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
    ["ArrowDown", "{ArrowDown}"],
    ["ArrowUp", "{ArrowUp}"],
  ])("opens with %s from the keyboard", async (_name, key) => {
    const user = userEvent.setup();
    renderPicker();
    await user.tab();
    await user.tab();
    expect(trigger()).toHaveFocus();

    await user.keyboard(key);

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(search()).toHaveFocus();
    expectNoSelection();
  });

  it("puts the current and browser languages first, then the rest by English name", async () => {
    setBrowserLanguages(["ja-JP", "fr", "de-DE"]);
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    const suggested = screen.getByRole("group", { name: "Suggested" });
    expect(within(suggested).getAllByRole("option").map((o) => o.getAttribute("data-code")))
      .toEqual(["es", "ja", "fr"]);
    const all = screen.getByRole("group", { name: "All languages" });
    // English, Greek: alphabetical by English name; German is not shipped.
    expect(within(all).getAllByRole("option").map((o) => o.getAttribute("data-code")))
      .toEqual(["en", "el"]);
  });

  it("shows each language with its native name and its English name", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    expect(option(/Ελληνικά/)).toHaveTextContent("Greek");
    expect(option(/Ελληνικά/)).toHaveTextContent("EL");
    expect(option(/Ελληνικά/)).not.toHaveTextContent("🇬🇷");
  });

  it.each([
    ["English name", "gre", ["el"]],
    ["native name", "ελλ", ["el"]],
    ["native name without accents", "francais", ["fr"]],
    ["code", "ja", ["ja"]],
  ])("finds a language by its %s", async (_kind, query, codes) => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.type(search(), query);

    expect(optionCodes()).toEqual(codes);
    expectNoSelection();
  });

  it("says so when no language matches", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.type(search(), "klingon");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No language found")).toBeInTheDocument();
  });

  it("selects the first match with Enter in the search field", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.type(search(), "gre{Enter}");

    expect(mockSetLocale).toHaveBeenCalledTimes(1);
    expect(mockSetLocale).toHaveBeenCalledWith("el");
    expect(mockReplace).toHaveBeenCalledWith("/dashboard", { locale: "el" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it("moves from the search field through the languages with arrows, Home and End", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    // Order: Español (current), English (browser), then French, Greek, Japanese.

    await user.keyboard("{ArrowDown}");
    expect(option(/Español/)).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(option(/English/)).toHaveFocus();
    await user.keyboard("{End}");
    expect(option(/日本語/)).toHaveFocus();
    await user.keyboard("{Home}");
    expect(option(/Español/)).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(search()).toHaveFocus();

    expectNoSelection();
  });

  it.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
  ])("selects exactly once with %s and restores focus after locale changes", async (_name, key) => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
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
    expect(option(/Français/)).toHaveAttribute("aria-selected", "true");
    expect(mockSetLocale).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it.each(["search", "option"])("dismisses with Escape from the %s without changing language", async (origin) => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    if (origin === "option") await user.keyboard("{ArrowDown}");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveFocus();
    expect(trigger()).toHaveTextContent("Español");
    expectNoSelection();
  });

  it("clears the search when it closes", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    await user.type(search(), "gre{Escape}");

    await user.click(trigger());

    expect(search()).toHaveValue("");
    expect(optionCodes()).toHaveLength(5);
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

  it("keeps the query string when switching language", async () => {
    // Page state such as the visualizer module (?module=) lives in the query
    // string; usePathname() alone would drop it. The hash is not passed: the
    // router already carries it over, and adding it again doubles it.
    window.history.replaceState(null, "", "/dashboard?tab=charts#supply");
    try {
      const user = userEvent.setup();
      renderPicker();
      await user.click(trigger());

      await user.click(option(/English/));

      expect(mockReplace).toHaveBeenCalledWith("/dashboard?tab=charts", {
        locale: "en",
      });
    } finally {
      window.history.replaceState(null, "", "/");
    }
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

  it("uses start/end (not left/right) spacing so Arabic lays out right to left", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    expect(option(/English/).className).toContain("text-start");
    expect(option(/English/).className).not.toMatch(/\btext-left\b/);
    expect(search().className).toContain("ps-9");
  });
});

describe("LanguageSwitcher on a phone", () => {
  // Touch screen below the 725px breakpoint: bottom sheet rendered into <body>.
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useLanguage).mockImplementation(useMockLanguage);
    setBrowserLanguages(["ja-JP"]);
    window.matchMedia = jest.fn().mockImplementation((q: string) => ({
      matches: q.includes("max-width: 724px") || q.includes("pointer: coarse"),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })) as unknown as typeof window.matchMedia;
  });
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it("opens a sheet in <body> with focus kept on the current language, not the search field", async () => {
    const user = userEvent.setup();
    const { container } = renderPicker();
    await user.click(trigger());

    const dialog = screen.getByRole("dialog", { name: "Language" });
    expect(container.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
    // Suggested is already filled when focus lands, so the option stays mounted.
    expect(option(/Español/)).toHaveFocus();
    expect(within(screen.getByRole("group", { name: "Suggested" })).getAllByRole("option").map((o) => o.getAttribute("data-code")))
      .toEqual(["es", "ja"]);
  });

  it("selects inside the sheet and closes it with the close button", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger()).toHaveFocus());

    await user.click(trigger());
    await user.click(option(/日本語/));
    expect(mockSetLocale).toHaveBeenCalledWith("ja");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the sheet open while typing in its search field", async () => {
    const user = userEvent.setup();
    renderPicker();
    await user.click(trigger());

    await user.click(search());
    await user.type(search(), "gre");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(optionCodes()).toEqual(["el"]);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
