import {
  QUIZ_BEGINNER,
  QUIZ_CONTRIBUTORS,
  QUIZ_INTERMEDIATE,
} from "../quizData";

const quizzes = [QUIZ_BEGINNER, QUIZ_INTERMEDIATE, QUIZ_CONTRIBUTORS];

describe("visualizer quiz data", () => {
  it("has usable questions, options, and correct answers in every quiz", () => {
    for (const questions of quizzes) {
      expect(questions.length).toBeGreaterThan(0);
      for (const { question, options, correctIndex } of questions) {
        expect(question.trim()).not.toBe("");
        expect(options.length).toBeGreaterThanOrEqual(2);
        expect(options.every((option) => option.trim().length > 0)).toBe(true);
        expect(Number.isInteger(correctIndex)).toBe(true);
        expect(correctIndex).toBeGreaterThanOrEqual(0);
        expect(correctIndex).toBeLessThan(options.length);
      }
    }
  });

  it("identifies Ironwood as the pool introduced with NU6.3", () => {
    const question = QUIZ_BEGINNER.find((item) =>
      item.question.includes("Which shielded pool was introduced with Zcash NU6.3?"),
    );

    expect(question).toBeDefined();
    expect(question?.options).toContain("Ironwood");
    expect(question?.options[question.correctIndex]).toBe("Ironwood");
  });

  it("identifies the post-NU6.3 Orchard restriction", () => {
    const question = QUIZ_INTERMEDIATE.find((item) =>
      item.question.includes("What changed for the Orchard pool after NU6.3 activated?"),
    );

    expect(question).toBeDefined();
    expect(question?.options[question.correctIndex]).toBe(
      "New value can no longer enter Orchard, while funds can move out toward Ironwood",
    );
  });

  it("does not retain the obsolete strongest-privacy questions", () => {
    const questions = quizzes.flatMap((quiz) => quiz.map((item) => item.question));

    expect(questions).not.toContain("Which pool offers the strongest privacy on Zcash?");
    expect(questions).not.toContain(
      "Which Zcash address pool offers the strongest privacy with no trusted setup requirement?",
    );
  });
});
