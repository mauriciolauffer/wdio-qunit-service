import type WdioQunitService from "../types/wdio.js";

/**
 * Generates Vitest test code from QUnit results.
 * @param {WdioQunitService.SuiteReport[]} results The QUnit results.
 * @returns {string} The Vitest test code.
 */
export function generateVitestTests(
  results: WdioQunitService.SuiteReport[],
): string {
  const tests = results
    .map((result) => {
      return `
      import { describe, it, expect } from 'vitest';

      describe('${result.name}', () => {
        ${result.tests
          .map(
            (test) => `
          it('${test.name}', () => {
            ${test.assertions
              .map(
                (assertion) => `
              expect(${assertion.actual}).toEqual(${assertion.expected});
            `,
              )
              .join("\n")}
          });
        `,
          )
          .join("\n")}
      });
    `;
    })
    .join("\n");

  return tests;
}
