import { expect, Locator, Page, test } from "@playwright/test";

// The quiz panel used the pale green text of its dark design in both
// appearances. In light appearance the panel is light grey-green, so the title
// measured about 1.7:1 and the question counter about 1.4:1. This reads the
// rendered colours in each appearance and checks WCAG AA: 4.5:1 for normal
// text, 3:1 for large text and for the close icon. (Next, white on green, is the
// same in both appearances and is not covered here.)
// Needs a server running (`yarn dev`, or `yarn build && yarn start`).
const BASE = process.env.VISUALIZER_BASE_URL || "http://localhost:3000";

// Instant transitions, so nothing is measured halfway through a fade.
test.use({ reducedMotion: "reduce" });

type Reading = { label: string; ratio: number; required: number };

/**
 * Contrast of the element's colour against what is painted behind it: the
 * background colours of the element and its ancestors, composited onto the
 * first opaque one. A canvas does the colour conversion and compositing.
 * Background images are skipped; in dark appearance that leaves the body
 * colour, the lightest stop of the page gradient and the worst case for light
 * text.
 */
async function measure(
  target: Locator,
  label: string,
  icon = false,
): Promise<Reading> {
  const { ratio, large } = await target.evaluate((el) => {
    const ctx = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true })!;
    const pixel = (colours: string[]) => {
      ctx.clearRect(0, 0, 1, 1);
      for (const colour of colours) {
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, 1, 1);
      }
      return Array.from(ctx.getImageData(0, 0, 1, 1).data);
    };
    const layers: string[] = [];
    for (let node: Element | null = el; node; node = node.parentElement) {
      const background = getComputedStyle(node).backgroundColor;
      const alpha = pixel([background])[3];
      if (alpha > 0) layers.unshift(background);
      if (alpha === 255) break;
    }
    const luminance = (colours: string[]) => {
      const [r, g, b] = pixel(["#fff", ...colours])
        .slice(0, 3)
        .map((v) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const style = getComputedStyle(el);
    const back = luminance(layers);
    const front = luminance([...layers, style.color]);
    const size = parseFloat(style.fontSize);
    const bold = parseInt(style.fontWeight, 10) >= 700;
    return {
      ratio: (Math.max(back, front) + 0.05) / (Math.min(back, front) + 0.05),
      large: size >= 24 || (size >= 18.66 && bold),
    };
  });
  return {
    label,
    ratio: Math.round(ratio * 100) / 100,
    required: icon || large ? 3 : 4.5,
  };
}

function expectReadable(readings: Reading[]) {
  const failing = readings
    .filter((r) => r.ratio < r.required)
    .map((r) => `${r.label}: ${r.ratio}:1, needs ${r.required}:1`);
  expect(failing).toEqual([]);
}

async function openQuiz(page: Page, appearance: "light" | "dark") {
  // next-themes keeps the choice in localStorage and sets the class on <html>.
  await page.addInitScript((theme) => {
    localStorage.setItem("theme", theme);
  }, appearance);
  await page.goto(`${BASE}/visualizer?quiz=basic`);
  await expect(page.locator("html")).toHaveClass(
    new RegExp(`\\b${appearance}\\b`),
  );
  const close = page.getByRole("button", { name: "Close quiz" });
  await expect(close).toBeVisible();
  return close.locator("xpath=ancestor::div[contains(@class,'border-2')][1]");
}

for (const appearance of ["light", "dark"] as const) {
  test.describe(`quiz in ${appearance} appearance`, () => {
    test("title, counter, close icon and chosen answer are readable", async ({
      page,
    }) => {
      const quiz = await openQuiz(page, appearance);
      await quiz.locator("[aria-pressed]").first().click();

      expectReadable([
        await measure(quiz.getByRole("heading", { level: 3 }), "quiz title"),
        await measure(quiz.getByText(/^Question \d+ of \d+$/), "counter"),
        await measure(
          quiz.getByRole("button", { name: "Close quiz" }),
          "close icon",
          true,
        ),
        await measure(quiz.locator('[aria-pressed="true"]'), "chosen answer"),
      ]);
    });

    test("Previous is readable once enabled", async ({ page }) => {
      const quiz = await openQuiz(page, appearance);
      await quiz.locator("[aria-pressed]").first().click();
      await quiz.getByRole("button", { name: "Next" }).click();

      const previous = quiz.getByRole("button", { name: "Previous" });
      await expect(previous).toBeEnabled();
      expectReadable([await measure(previous, "Previous")]);
    });

    test("results are readable", async ({ page }) => {
      const quiz = await openQuiz(page, appearance);
      const counter = quiz.getByText(/^Question \d+ of \d+$/);
      const total = Number((await counter.textContent())!.match(/of (\d+)/)![1]);
      // Always take the first option, so at least one answer is wrong and
      // the "You chose" line is shown. The answered question fades out before
      // the next one mounts, so wait until no answer is selected.
      for (let n = 1; n <= total; n++) {
        await expect(counter).toHaveText(`Question ${n} of ${total}`);
        await expect(quiz.locator('[aria-pressed="true"]')).toHaveCount(0);
        await quiz.locator("[aria-pressed]").first().click();
        await quiz
          .getByRole("button", { name: /^(Next|See results)$/ })
          .click();
      }
      const retry = quiz.getByRole("button", { name: "Retry Quiz" });
      await expect(retry).toBeVisible();

      expectReadable([
        await measure(quiz.getByRole("heading", { level: 3 }), "quiz title"),
        await measure(quiz.getByText("Score:", { exact: true }), "score label"),
        await measure(quiz.getByText(/^\d+ \/ \d+$/), "score value"),
        await measure(retry, "Retry Quiz"),
        await measure(
          quiz.getByText("Correct answers", { exact: true }),
          "Correct answers",
        ),
        await measure(quiz.getByText(/^Correct: /).first(), "correct answer"),
        await measure(quiz.getByText(/^\(You chose: /).first(), "your answer"),
        await measure(
          quiz.getByRole("button", { name: "Previous" }),
          "Previous",
        ),
      ]);
    });
  });
}
