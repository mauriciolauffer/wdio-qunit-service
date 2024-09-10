import type { Capabilities, Services } from "@wdio/types";
import type { ServiceEntry } from "@wdio/types/build/Services";
import type WdioQunitService from "./types/wdio";
import { join } from "node:path";
import { URL } from "node:url";
import logger from "@wdio/logger";
import { getDirname } from "cross-dirname";
import { injectQUnitReport, getQUnitSuiteReport } from "./qunit-browser.js";

const log = logger("wdio-qunit-service");

/**
 * Get QUnit service configuration
 */
function getServiceConfig(
  services?: ServiceEntry[],
): WdioQunitService.ServiceOption {
  return services
    ?.filter(
      (service) =>
        Array.isArray(service) && service?.find((option) => option === "qunit"),
    )
    .flat()
    .filter(
      (service) =>
        service &&
        (service as WdioQunitService.ServiceOption)?.paths?.length > 0,
    )?.[0] as WdioQunitService.ServiceOption;
}

/**
 * Get path to the QUnit HTML files
 */
function getQUnitHtmlFiles(paths: string[], baseUrl?: string): string[] {
  return paths
    .filter((path) => {
      try {
        new URL(path, baseUrl);
        return true;
      } catch (err) {
        const invalid = new Error(`Invalid URL: ${baseUrl} +++ ${path}`, {
          cause: err,
        });
        log.warn(path, invalid?.message);
        return false;
      }
    })
    .flat();
}

/**
 * Use QUnit events to get test results when QUnit run has ended
 */
async function getQunitResultsFromBrowser(
  browserInstance: WebdriverIO.Browser,
): Promise<WdioQunitService.SuiteReport> {
  log.debug("Waiting for QUnit...");
  try {
    await browserInstance.waitUntil(() => {
      return browserInstance.execute(
        () => window?._wdioQunitService?.suiteReport?.completed,
      );
    });
  } catch (err) {
    log.error(
      "Consider increasing the waitforTimeout config in your wdio.conf.js",
    );
    log.error("See https://webdriver.io/docs/timeouts/#waitfor-timeout");
    throw err;
  }
  return browserInstance.executeAsync(getQUnitSuiteReport);
}

/**
 * Generate test cases from QUnit results
 */
async function generateTestCases(
  qunitResults: WdioQunitService.SuiteReport,
): Promise<void> {
  log.debug("Generating test cases...");
  convertQunitModules(qunitResults.childSuites);
  if (qunitResults.tests.length > 0) {
    describe("...", function mappingQunitTestsWithoutModule() {
      convertQunitTests(qunitResults.tests);
    });
  }
  describe(`QUnit Reporter ${qunitResults.name}`, function mappingQunitReporter() {
    it("should pass", async function mappingQunitResultSuccess() {
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
        }
        await expect(qunitAssertion.actual).toEqual(qunitAssertion.expected);
      }
    });
  }
}

/**
 * Get QUnit results
 */
async function getQUnitResults(
  this: WebdriverIO.Browser,
): Promise<WdioQunitService.SuiteReport> {
  log.info("Getting QUnit results...");
  const qunitResults = await getQunitResultsFromBrowser(this);
  await generateTestCases(qunitResults);
  return qunitResults;
}

export default class QUnitService implements Services.ServiceInstance {
  async before(
    capabilities: Capabilities.RequestedMultiremoteCapabilities,
    specs: string[],
    browserInstance: WebdriverIO.Browser,
  ): Promise<void> {
    log.debug("Executing before hook...");
    browserInstance.addCommand(
      "getQUnitResults",
      getQUnitResults.bind(browserInstance),
    );
    const script = await browser.addInitScript(injectQUnitReport);
    script.on("data", () => {
      log.warn("QUnit reporter has been injected...");
    });
  }

  beforeSession(config: Omit<WebdriverIO.Config, "capabilities">): void {
    log.debug("Executing beforeSession hook...");
    const serviceConfig = getServiceConfig(config?.services || []);
    const files = getQUnitHtmlFiles(
      serviceConfig?.paths || [],
      config?.baseUrl,
    );
    if (files.length > 0) {
      globalThis._WdioQunitServiceHtmlFiles = files;
    }
  }
}

class CustomLauncher implements Services.ServiceInstance {
  onPrepare(config: WebdriverIO.Config): void {
    log.debug("Executing onPrepare launcher...");
    const serviceConfig = getServiceConfig(config?.services);
    const files = getQUnitHtmlFiles(
      serviceConfig?.paths || [],
      config?.baseUrl,
    );
    if (files.length > 0) {
      config.specs?.push(join(getDirname(), "default.test.js"));
    }
  }
}

export { WdioQunitService };
export const launcher = CustomLauncher;
