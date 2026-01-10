import type { Plugin } from "vite";
import type { VitestPluginContext } from "vitest/node";
import type { QUnitPluginOptions } from "./types.js";
import { runQunitTests } from "./runner.js";
import { generateVitestTests } from "./generator.js";
import { promises as fs } from "fs";
import { join } from "path";

interface QUnitPlugin extends Plugin {
  api: {
    options: QUnitPluginOptions;
  };
}

/**
 * The Vitest plugin for running QUnit tests.
 * @param {QUnitPluginOptions} options The plugin options.
 * @returns {Plugin} The Vitest plugin.
 */
export function qunit(options: QUnitPluginOptions): Plugin {
  return {
    name: "vitest:qunit",
    api: {
      options,
    },
    async configureVitest(context: VitestPluginContext) {
      const results = await runQunitTests(options);
      const testCode = generateVitestTests(results);

      const tmpDir = join(context.project.config.root, ".tmp");
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await fs.mkdir(tmpDir, { recursive: true });
      const testFile = join(tmpDir, "vitest-qunit.test.ts");
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await fs.writeFile(testFile, testCode);

      context.injectTestProjects([
        {
          test: {
            include: [testFile],
          },
        },
      ]);
    },
  };
}
