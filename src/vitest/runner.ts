import { chromium } from "playwright";
import type { QUnitPluginOptions } from "./types.js";
import { getQUnitSuiteReport, injectQUnitReport } from "../qunit-browser.js";
import type WdioQunitService from "../types/wdio.js";

/**
 * Runs the QUnit tests in a headless browser.
 * @param {QUnitPluginOptions} options The plugin options.
 * @returns {Promise<WdioQunitService.SuiteReport[]>} The QUnit test results.
 */
export async function runQunitTests(
  options: QUnitPluginOptions,
): Promise<WdioQunitService.SuiteReport[]> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const results: WdioQunitService.SuiteReport[] = [];

  for (const path of options.paths) {
    const url = new URL(path, options.baseUrl).toString();
    const page = await context.newPage();
    await page.goto(url);

    // Inject the QUnit reporter
    await page.evaluate(`(${injectQUnitReport.toString()})()`);

    // Wait for the tests to finish
    await page.waitForFunction(
      () =>
        (window as Window & typeof globalThis & { _wdioQunitService: WdioQunitService.Reporter })
          ._wdioQunitService?.results?.[0]?.completed,
    );

    // Get the results
    const result = await page.evaluate(getQUnitSuiteReport);
    results.push(...result);

    await page.close();
  }

  await browser.close();
  return results;
}
