import type { QUnitPluginOptions } from "./types.js";
import { getQUnitSuiteReport } from "../qunit-browser.js";

/**
 * Generates Vitest test code from QUnit results.
 * @param {QUnitPluginOptions} options The plugin options.
 * @returns {string} The Vitest test code.
 */
export function generateVitestTests(options: QUnitPluginOptions): string {
  const tests = options.paths
    .map((path) => {
      const url = new URL(path, options.baseUrl).toString();
      return `
      import { describe, it, expect, vi } from 'vitest';
      import { browser } from '@vitest/browser';

      describe('QUnit tests for ${path}', () => {
        it('should pass all tests', async () => {
          await browser.visit('${url}');
          await browser.executeScript(\`(${getQUnitSuiteReport.toString()})\`);
          await vi.waitFor(async () => {
            const completed = await browser.executeScript(() => window._wdioQunitService?.results?.[0]?.completed);
            expect(completed).toBe(true);
          });
          const results = await browser.executeScript(() => window._wdioQunitService.results);
          expect(results[0].failed).toBe(0);
        });
      });
    `;
    })
    .join("\n");

  return tests;
}
