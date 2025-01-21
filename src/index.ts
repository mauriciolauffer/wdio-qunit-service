import type { Capabilities, Services } from "@wdio/types";
import type { ServiceEntry } from "@wdio/types/build/Services";
import type WdioQunitService from "./types/wdio";
import { join } from "node:path";
import { URL } from "node:url";
import logger from "@wdio/logger";
import { getDirname } from "cross-dirname";
import { injectQUnitReport, getQUnitSuiteReport } from "./qunit-browser.js";
import { sharedContext } from "./sharedContext.js";
import { generateTestCases } from "./mapper.js";

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
): Promise<WdioQunitService.SuiteReport[]> {
  log.debug("Waiting for QUnit...");
  await browserInstance.waitUntil(
    () => {
      return browserInstance.execute(
        () =>
          window?._wdioQunitService?.results?.filter?.(
            (result) => !result.completed,
          ).length === 0,
      );
    },
    {
      timeoutMsg:
        "QUnit took too long to complete. Consider increasing waitforTimeout in wdio.conf.js. See https://webdriver.io/docs/timeouts/#waitfor-timeout",
    },
  );
  return browserInstance.execute(getQUnitSuiteReport);
}

/**
 * Get QUnit results
 */
async function getQUnitResults(
  this: WebdriverIO.Browser,
): Promise<WdioQunitService.SuiteReport[]> {
  log.info("Getting QUnit results...");
  const qunitResults = await getQunitResultsFromBrowser(this);
  qunitResults.forEach((result) => {
    generateTestCases(result);
  });
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
    script.on("data", (href: string) => {
      log.warn("QUnit reporter injected at", href);
    });
  }

  beforeSession(config: Omit<WebdriverIO.Config, "capabilities">): void {
    log.debug("Executing beforeSession hook...");
    const serviceConfig = getServiceConfig(config?.services ?? []);
    const files = getQUnitHtmlFiles(
      serviceConfig?.paths ?? [],
      config?.baseUrl,
    );
    if (files.length > 0) {
      sharedContext.qunitHtmlFiles = files;
    }
  }
}

class CustomLauncher implements Services.ServiceInstance {
  onPrepare(config: WebdriverIO.Config): void {
    log.debug("Executing onPrepare launcher...");
    const serviceConfig = getServiceConfig(config?.services);
    const files = getQUnitHtmlFiles(
      serviceConfig?.paths ?? [],
      config?.baseUrl,
    );
    if (files.length > 0) {
      config.specs?.push(join(getDirname(), "default.test.js"));
    }
  }
}

export { WdioQunitService };
export const launcher = CustomLauncher;
