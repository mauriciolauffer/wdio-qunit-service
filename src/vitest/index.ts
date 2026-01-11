import type { Plugin } from "vite";
import type { QUnitPluginOptions } from "./types.js";
import { generateVitestTests } from "./generator.js";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * The Vitest plugin for running QUnit tests.
 * @param {QUnitPluginOptions} options The plugin options.
 * @returns {Plugin} The Vitest plugin.
 */
export function qunit(options: QUnitPluginOptions): Plugin {
  return {
    name: "vitest:qunit",
    async config() {
      const testCode = generateVitestTests(options);
      const tmpDir = join(process.cwd(), ".tmp");
      await fs.mkdir(tmpDir, { recursive: true });
      const testFile = join(tmpDir, "vitest-qunit.test.ts");
      await fs.writeFile(testFile, testCode);
    },
  };
}
