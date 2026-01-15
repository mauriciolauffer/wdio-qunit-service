import { defineConfig } from "vitest/config";
import { qunit } from "wdio-qunit-service/vitest";
import { playwright } from "@vitest/browser-playwright";
import CustomReporter from "../../src/vitest/custom-reporter";

export default defineConfig({
  plugins: [
    qunit({
      paths: ["examples/vitest/test.html"],
      baseUrl: "http://localhost:8083",
    }),
  ],
  test: {
    reporters: [new CustomReporter()],
    include: [".tmp/vitest-qunit.test.ts"],
    browser: {
      enabled: true,
      name: "chromium",
      provider: () => playwright,
      headless: true,
    },
  },
});
