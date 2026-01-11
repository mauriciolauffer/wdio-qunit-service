import { defineConfig } from "vitest/config";
import { qunit } from "wdio-qunit-service/vitest";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [
    qunit({
      paths: ["examples/vitest/test.html"],
      baseUrl: "http://localhost:8083",
    }),
  ],
  test: {
    include: [".tmp/vitest-qunit.test.ts"],
    browser: {
      enabled: true,
      name: "chromium",
      provider: () => playwright,
      headless: true,
    },
  },
});
