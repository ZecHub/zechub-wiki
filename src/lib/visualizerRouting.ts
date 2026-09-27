/**
 * URL state for the visualizer hub.
 *
 * The hub renders one module at a time out of client state. These helpers put
 * that selection in the query string instead, so a module can be linked,
 * reloaded and reached with the browser's back button:
 *
 *   /visualizer                        the hub itself
 *   /visualizer?module=frost-multisig  one visualizer
 *   /visualizer?quiz=advanced          the hub with a quiz open
 *
 * Kept free of React and of the hub's component table so it can be unit
 * tested on its own; the caller passes the ids it actually renders, which is
 * also what stops this file and the hub's list from drifting apart.
 */

export const MODULE_PARAM = "module";
export const QUIZ_PARAM = "quiz";

export const QUIZ_SECTIONS = ["basic", "advanced", "contributors"] as const;
export type QuizSection = (typeof QUIZ_SECTIONS)[number];

/** The minimum of URLSearchParams this module needs, so tests (and the
 * Next.js ReadonlyURLSearchParams) can both satisfy it. */
export type ReadableParams = { get(name: string): string | null };

export type VisualizerRoute<Id extends string> = {
  /** The module to show, or null for the hub. */
  module: Id | null;
  /** The quiz to open on the hub, or null. Always null when a module is shown. */
  quiz: QuizSection | null;
  /**
   * False when the address bar does not match what is being rendered — an
   * unknown id, a mis-cased id, or both params at once. The hub replaces the
   * URL in that case, so a bad link lands somewhere real and shareable rather
   * than leaving a broken id in the address bar.
   */
  canonical: boolean;
};

const isQuizSection = (value: string): value is QuizSection =>
  (QUIZ_SECTIONS as readonly string[]).includes(value);

/**
 * Read the hub's state out of a query string.
 *
 * Unknown module or quiz values resolve to the hub rather than throwing or
 * rendering an empty screen. Module ids match case-insensitively and resolve
 * to their canonical spelling, so a hand-typed `?module=crosslink-protocol`
 * still reaches `CrossLink-Protocol`.
 */
export function resolveVisualizerRoute<Id extends string>(
  params: ReadableParams | null | undefined,
  knownIds: readonly Id[],
): VisualizerRoute<Id> {
  const rawModule = params?.get(MODULE_PARAM)?.trim() ?? "";
  const rawQuiz = params?.get(QUIZ_PARAM)?.trim() ?? "";

  let canonical = true;

  let moduleId: Id | null = null;
  if (rawModule) {
    moduleId =
      knownIds.find((id) => id.toLowerCase() === rawModule.toLowerCase()) ??
      null;
    // Unknown id, or the right module reached by a different spelling.
    if (moduleId === null || moduleId !== rawModule) canonical = false;
  }

  let quiz: QuizSection | null = null;
  if (rawQuiz) {
    if (isQuizSection(rawQuiz)) quiz = rawQuiz;
    else canonical = false;
  }

  // A quiz belongs to the hub, so a module wins if somehow both are present.
  if (moduleId !== null && quiz !== null) {
    quiz = null;
    canonical = false;
  }

  return { module: moduleId, quiz, canonical };
}

/**
 * The query string for a given selection, including the leading "?"; an empty
 * string for the hub so the address stays a bare /visualizer.
 */
export function visualizerQuery(route: {
  module?: string | null;
  quiz?: string | null;
}): string {
  if (route.module)
    return `?${MODULE_PARAM}=${encodeURIComponent(route.module)}`;
  if (route.quiz) return `?${QUIZ_PARAM}=${encodeURIComponent(route.quiz)}`;
  return "";
}

/** Path + query for a selection, e.g. "/visualizer?module=governance". */
export function visualizerHref(
  pathname: string,
  route: { module?: string | null; quiz?: string | null },
): string {
  return `${pathname}${visualizerQuery(route)}`;
}
