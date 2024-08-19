import type { Capabilities, Services } from "@wdio/types";
import type { ServiceEntry } from "@wdio/types/build/Services";
import type WdioQunitService from "./types/wdio";
import { join } from "node:path";
import { URL } from "node:url";
import logger from "@wdio/logger";
import { getDirname } from "cross-dirname";
import getQUnitReportResults from "./qunit-browser.js";

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
function qunitHooks(
  browserInstance: WebdriverIO.Browser,
): Promise<WdioQunitService.RunEndDetails> {
  log.debug("Waiting for QUnit...");
  return browserInstance.executeAsync(getQUnitReportResults);
}

/**
 * Generate test cases from QUnit results
 */
function generateTestCases(qunitResults: WdioQunitService.RunEndDetails): void {
  log.debug("Generating test cases...");
  convertQunitModules(qunitResults.childSuites);
  if (qunitResults.tests.length > 0) {
    describe("...", function () {
      convertQunitTests(qunitResults.tests);
    });
  }
  expect(qunitResults?.status).toEqual("passed");
}

/**
 * Convert QUnit Modules into 'describe' blocks
 */
function convertQunitModules(
  qunitModules: WdioQunitService.ChildSuite[],
): void {
  for (const qunitChildSuite of qunitModules) {
    log.debug(`Creating "describe" ${qunitChildSuite.name}`);
    describe(qunitChildSuite.name || "...", function () {
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
    it(qunitTest.name, () => {
      for (const qunitAssertion of qunitTest.assertions) {
        log.debug(
          `Creating "expect" ${qunitTest.name} - ${qunitAssertion?.message}`,
        );
        expect(qunitAssertion?.passed).toEqual(true);
      }
    });
  }
}

/**
 * Get QUnit results
 */
async function getQUnitResults(
  this: WebdriverIO.Browser,
): Promise<WdioQunitService.RunEndDetails> {
  log.info("Getting QUnit results...");
  const qunitResults = await qunitHooks(this);
  generateTestCases(qunitResults);
  return qunitResults;
}

export default class QUnitService implements Services.ServiceInstance {
  before(
    capabilities: Capabilities.RequestedMultiremoteCapabilities,
    specs: string[],
    browserInstance: WebdriverIO.Browser,
  ): void {
    log.debug("Executing before hook...");
    browserInstance.addCommand(
      "getQUnitResults",
      getQUnitResults.bind(browserInstance),
    );
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
