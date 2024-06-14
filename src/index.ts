import type {Capabilities, Services} from '@wdio/types';
import type {ServiceEntry} from '@wdio/types/build/Services';
import type WdioQunitService from './types/wdio';
import {join} from 'node:path';
import {URL} from 'node:url';
import logger from '@wdio/logger';
import {getDirname} from 'cross-dirname';

const log = logger('wdio-qunit-service');

/**
 * Get QUnit service configuration
 */
function getServiceConfig(services?: ServiceEntry[]): WdioQunitService.ServiceOption {
  return services?.filter((service) => Array.isArray(service) && service?.find((option) => option === 'qunit'))
      .flat()
      .filter((service) => service && (service as WdioQunitService.ServiceOption)?.paths?.length > 0)
      ?.[0] as WdioQunitService.ServiceOption;
}

/**
 * Get path to the QUnit HTML files
 */
function getQUnitHtmlFiles(paths: string[], baseUrl?: string): string[] {
  return paths.filter((path) => {
    try {
      new URL(path, baseUrl);
      return true;
    } catch (err: Error | any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      log.warn(path, err?.message);
      return false;
    }
  })
      .flat();
}

/**
 * Use QUnit events to get test results when QUnit run has ended
 */
async function qunitHooks(
    browserInstance: WebdriverIO.Browser
): Promise<WdioQunitService.RunEndDetails> {
  log.debug('Waiting for QUnit to load...');
  await browserInstance.waitUntil(
      () => browserInstance.execute(isQunitLoaded),
      {
        timeout: 60000,
        timeoutMsg: 'QUnit took too long to load.',
        interval: 50
      }
  );
  log.debug('Waiting for QUnit runEnd event...');
  let qunitResults = await browserInstance.executeAsync(
      QunitFinishedEventInBrowserContext
  );
  if (!qunitResults) {
    await browserInstance.waitUntil(
        () => browserInstance.execute(hasQunitFinished),
        {
          timeout: 120000,
          timeoutMsg: 'QUnit took too long to complete.',
          interval: 100
        }
    );
    qunitResults = await browserInstance.executeAsync(
        QunitExtractResultsInBrowserContext
    );
  }
  return qunitResults;
}

/**
 * Await for QUnit to be made available in the page
 */
function isQunitLoaded(): boolean {
  return !!window?.QUnit;
}

/**
 * Await for QUnit to finish running the tests
 */
function hasQunitFinished(): boolean {
  return !!QUnit.config?.started && QUnit.config?.queue?.length === 0 && (QUnit.config.pq === undefined || !!QUnit.config?.pq?.finished);
}

/**
 * Await for QUnit to finish running the tests
 */
function QunitFinishedEventInBrowserContext(
    done: (result: WdioQunitService.RunEndDetails | void) => void
) {
  QUnit.on('runEnd', function(qunitRunEnd) {
    console.debug('QUnit runEnd event was triggered.'); // eslint-disable-line no-console
    done(qunitRunEnd);
  });
  setTimeout(() => {
    // Check whether tests have already been completed, QUnit event runEnd won't be triggered
    if (QUnit.config?.started > 0 && QUnit.config?.queue?.length === 0) {
      console.debug('QUnit.config.started:', QUnit.config?.started); // eslint-disable-line no-console
      console.debug('QUnit.config.queue.length:', QUnit.config?.queue?.length); // eslint-disable-line no-console
      console.debug('QUnit.config.pq.finished:', QUnit.config?.pq?.finished); // eslint-disable-line no-console
      done();
    }
  }, 100);
}

/**
 * Extract QUnit results when QUnit runEnd event is not triggered
 */
function QunitExtractResultsInBrowserContext(
    done: (result: WdioQunitService.RunEndDetails) => void
) {
  const qunitResultsFromConfigModules: WdioQunitService.RunEndDetails = {
    status: '',
    childSuites: [],
    tests: []
  };
  for (const qunitConfigModule of QUnit.config.modules) {
    qunitResultsFromConfigModules.status =
      QUnit.config.stats.all > 0 && QUnit.config.stats.bad === 0 ?
        'passed' :
        'failed';
    qunitResultsFromConfigModules.childSuites = [
      ...qunitResultsFromConfigModules.childSuites,
      ...qunitConfigModule.suiteReport.childSuites
    ];
    qunitResultsFromConfigModules.tests = [
      ...qunitResultsFromConfigModules.tests,
      ...qunitConfigModule.suiteReport.tests
    ];
  }
  console.debug('QUnit runEnd event will not be triggered, manually finishing it.'); // eslint-disable-line no-console
  done(qunitResultsFromConfigModules);
}

/**
 * Generate test cases from QUnit results
 */
function generateTestCases(qunitResults: WdioQunitService.RunEndDetails): void {
  log.debug('Generating test cases...');
  convertQunitModules(qunitResults.childSuites);
  if (qunitResults.tests.length > 0) {
    describe('...', function() {
      convertQunitTests(qunitResults.tests);
    });
  }
  expect(qunitResults?.status).toEqual('passed');
}

/**
 * Convert QUnit Modules into 'describe' blocks
 */
function convertQunitModules(
    qunitModules: WdioQunitService.ChildSuite[]
): void {
  for (const qunitChildSuite of qunitModules) {
    log.debug(`Creating "describe" ${qunitChildSuite.name}`);
    describe(qunitChildSuite.name || '...', function() {
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
            `Creating "expect" ${qunitTest.name} - ${qunitAssertion?.message}`
        );
        expect(qunitAssertion?.passed).toEqual(true);
      }
    });
  }
}

/**
 * Get QUnit results
 */
async function getQUnitResults(this: WebdriverIO.Browser): Promise<WdioQunitService.RunEndDetails> {
  log.info('Getting QUnit results...');
  const qunitResults = await qunitHooks(this); // eslint-disable-line no-invalid-this
  generateTestCases(qunitResults);
  return qunitResults;
}

export default class QUnitService implements Services.ServiceInstance {
  before(
      capabilities: Capabilities.RemoteCapability,
      specs: string[],
      browserInstance: WebdriverIO.Browser
  ): void {
    log.debug('Executing before hook...');
    browserInstance.addCommand(
        'getQUnitResults',
        getQUnitResults.bind(browserInstance)
    );
  }

  beforeSession(config: Omit<WebdriverIO.Config, 'capabilities'>): void {
    log.debug('Executing beforeSession hook...');
    const serviceConfig = getServiceConfig(config?.services || []);
    const files = getQUnitHtmlFiles(serviceConfig?.paths || [], config?.baseUrl);
    if (files.length > 0) {
      globalThis._WdioQunitServiceHtmlFiles = files;
    }
  }
}

class CustomLauncher implements Services.ServiceInstance {
  onPrepare(config: WebdriverIO.Config): void {
    log.debug('Executing onPrepare launcher...');
    const serviceConfig = getServiceConfig(config?.services);
    const files = getQUnitHtmlFiles(serviceConfig?.paths || [], config?.baseUrl);
    if (files.length > 0) {
      config.specs?.push(join(getDirname(), 'default.test.js'));
    }
  }
}

export {WdioQunitService};
export const launcher = CustomLauncher;
