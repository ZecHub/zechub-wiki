import { render, screen } from "@testing-library/react";
import SideMenu from "../SideMenu";
import { getSideMenuLabel } from "@/lib/sideMenuLabel";

jest.mock("@/lib/authAndFetch", () => ({}));
jest.mock("next/navigation", () => ({ usePathname: () => "/ar/guides/Long_Title" }));
jest.mock("@/context/LanguageContext", () => ({ useLanguage: () => ({ t: {} }) }));
jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a>,
}));

const item = "site/guides/Long_Title";
const key = "guides/Long_Title.md";
const arabic = "دليل استخدام المحفظة المادية لحماية المدفوعات والمعاملات الخاصة";

describe("sidebar title fallback", () => {
  it.each([arabic, "A long English title that exceeds the old thirty-six character limit", "長いタイトル".repeat(15)])(
    "retains a localized title regardless of its JS length: %s", (title) => {
      expect(title.length).toBeGreaterThan(36);
      expect(getSideMenuLabel(item, { [key]: title }, { [key]: "English" })).toBe(title);
    },
  );
  it.each([undefined, "", "   "])("uses English for absent/blank localized titles (%s)", (title) => {
    const titles: Record<string, string> = title === undefined ? {} : { [key]: title };
    expect(getSideMenuLabel(item, titles, { [key]: "A long English fallback that must remain readable in the sidebar" }))
      .toBe("A long English fallback that must remain readable in the sidebar");
  });
  it("uses filename as last fallback and trims valid text", () => {
    expect(getSideMenuLabel(item, {}, {})).toBe("Long Title");
    expect(getSideMenuLabel(item, { [key]: "  عنوان  " }, {})).toBe("عنوان");
  });
  it.each(["ZEC_Use_Cases", "Zcash_Monetary_Policy"])("preserves duplicate-H1 correction for %s, not for Arabic", (file) => {
    const path = `site/Start_Here/${file}`;
    const k = `Start_Here/${file}.md`;
    expect(getSideMenuLabel(path, {}, { [k]: "Zcash Basics" })).not.toBe("Zcash Basics");
    expect(getSideMenuLabel(path, { [k]: arabic }, { [k]: "Zcash Basics" })).toBe(arabic);
  });
  it("renders long Arabic text and a separate English fallback in the real component", () => {
    render(<SideMenu folder="guides" roots={[item + ".md", "site/guides/Missing.md"]}
      titles={{ [key]: arabic }} enTitles={{ "guides/Missing.md": "English fallback" }} />);
    expect(screen.getByRole("link", { name: arabic })).toHaveAttribute("href", expect.stringContaining("#content"));
    expect(screen.getByRole("link", { name: "English fallback" })).toBeInTheDocument();
  });
  it("renders markup-shaped manifest text literally, never as HTML", () => {
    const title = '<img src=x onerror="alert(1)"> عنوان طويل لا يجب تنفيذه';
    const { container } = render(<SideMenu folder="guides" roots={[item + ".md"]} titles={{ [key]: title }} />);
    expect(screen.getByRole("link", { name: title })).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
});
