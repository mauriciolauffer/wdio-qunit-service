import type WdioQunitService from "./types/wdio.js";

/**
 * Transforms the QUnit results into a structured format.
 * @param {WdioQunitService.SuiteReport[]} results The QUnit results.
 * @returns {WdioQunitService.SuiteReport[]} The transformed results.
 */
export function transformQUnitResults(
  results: WdioQunitService.SuiteReport[],
): WdioQunitService.SuiteReport[] {
  // For now, we'll just return the results as-is.
  // In the future, we can add more sophisticated transformations here.
  return results;
}
