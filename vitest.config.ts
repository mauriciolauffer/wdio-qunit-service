import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
      include: ["src/**/*.ts"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/tests/**", "**/*.test.ts", "src/lib/auth.ts", "src/types/**", "src/default.test.ts"],
    },
    include: ["test/unit/**/*.test.ts"],
  },
});
