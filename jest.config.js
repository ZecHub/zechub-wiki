const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config}*/
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: ["<rootDir>/e2e"], // ignores e2e
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
};

module.exports = createJestConfig(customJestConfig);
