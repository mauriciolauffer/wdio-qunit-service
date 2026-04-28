import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "jest", "node", "jsdoc", "promise", "import"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    pedantic: "warn",
  },
  rules: {
    "jsdoc/require-param": "off",
    "jsdoc/require-returns": "off",
    "no-underscore-dangle": "off",
    "no-inline-comments": "off",
    "max-classes-per-file": "off",
    "no-new": "off",
    "max-lines-per-function": "off",
    "no-shadow": "off",
    "jest/no-conditional-in-test": "off",
  },
  ignorePatterns: [
    "dist/",
    "examples/openui5-sample-app*",
    "examples/ui5-typescript-helloworld",
    "**/coverage/",
  ],
  overrides: [
    {
      files: ["**/*.test.*"],
      rules: {
        "jest/expect-expect": "off",
        "jest/no-disabled-tests": "off",
        "no-warning-comments": "off",
      },
    },
  ],
});
