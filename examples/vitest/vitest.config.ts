import { defineConfig } from "vitest/config";
import { qunit } from "wdio-qunit-service/vitest";

export default defineConfig({
  plugins: [
    qunit({
      paths: ["examples/vitest/test.html"],
      baseUrl: "http://localhost:8083",
    }),
  ],
  test: {
    include: [".tmp/vitest-qunit.test.ts"],
  },
});
