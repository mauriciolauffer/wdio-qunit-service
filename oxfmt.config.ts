import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    "CHANGELOG.md",
    "pnpm-lock.yaml",
    "examples/openui5-sample-app*",
    ".agents/**",
    ".claude/**",
  ],
});
