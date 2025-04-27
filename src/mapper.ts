import type WdioQunitService from "./types/wdio.js";
import logger from "@wdio/logger";

const log = logger("wdio-qunit-service");

/**
 * Generate test cases from QUnit results
 */
export function generateTestCases(qunitResults: WdioQunitService.SuiteReport) {
  log.debug("Generating test cases...");
  convertQunitModules(qunitResults.childSuites);
  if (qunitResults.tests.length > 0) {
    describe("...", function mappingQunitTestsWithoutModule() {
      convertQunitTests(qunitResults.tests);
    });
  }
  describe(`Injected WDIO QUnit Reporter`, function mappingQunitReporter() {
    it(qunitResults.name, async function mappingQunitResultSuccess() {
      await expect(qunitResults.success).toEqual(true);
    });
  });
}

/**
 * Convert QUnit Modules into 'describe' blocks
 */
function convertQunitModules(
  qunitModules: WdioQunitService.ChildSuite[],
): void {
  for (const qunitChildSuite of qunitModules) {
    log.debug(`Creating "describe" ${qunitChildSuite.name}`);
    describe(qunitChildSuite.name || "...", function mappingQunitModules() {
      convertQunitTests(qunitChildSuite.tests);
      convertQunitModules(qunitChildSuite.childSuites);
    });
  }
}

/**
 * Convert QUnit Tests into 'it' blocks
 */
function convertQunitTests(qunitTests: WdioQunitService.TestReport[]): void {
  for (const qunitTest of qunitTests) {
    log.debug(`Creating "it" ${qunitTest.name}`);
    if (qunitTest.skipped) {
      it.skip(qunitTest.name, function mappingQunitTestsSkipped() {
        log.debug(`Skipping ${qunitTest.name}`);
      });
    } else {
      it(qunitTest.name, async function mappingQunitTests() {
        for (const qunitAssertion of qunitTest.assertions) {
          log.debug(
            `Creating "expect" ${qunitTest.name}.${qunitAssertion?.message}`,
          );
          if (!qunitAssertion.success) {
            log.error(`QUnit Test: ${qunitTest.suiteName}.${qunitTest.name}`);
            log.error(`Expected: ${qunitAssertion.expected}`);
            log.error(`Received: ${qunitAssertion.actual}`);
            log.error(`Message: ${qunitAssertion.message}`);
            log.error(`Source: ${qunitAssertion.source}`);
            if (qunitAssertion.negative) {
              await expect(qunitAssertion.actual).not.toEqual(
                qunitAssertion.expected,
              );
            } else {
              await expect(qunitAssertion.actual).toEqual(
                qunitAssertion.expected,
              );
            }
          }
          await expect(qunitAssertion.success).toEqual(true); // It also works as a failsafe to catch-all
        }
      });
    }
  }
}
