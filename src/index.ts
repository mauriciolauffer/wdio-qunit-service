import type {Capabilities, Services } from '@wdio/types';
import type WdioQunitService from './types/wdio';
import {join} from 'node:path';
import {URL} from 'node:url';
import logger from '@wdio/logger';
import {getDirname} from 'cross-dirname';

const log = logger('wdio-qunit-service');

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
    browserInstance: WebdriverIO.Browser,
    options: WdioQunitService.ServiceOption,
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
  const qunitResults = await browserInstance.executeAsync(
      QunitFinishedEventInBrowserContext, options.autostartDelay
  );

  if (!qunitResults) {
    log.error('QUnit test run finished too quickly to collect results. Please disable autostart for QUnit while executing tests via WDIO, or add a delay to test start.');
    return {
      status: 'failed',
      childSuites: [],
      tests: [],
    }
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
async function QunitFinishedEventInBrowserContext(
    autostartDelay: number,
    done: (result?: WdioQunitService.RunEndDetails) => void
) {
  QUnit.on('runEnd', function(qunitRunEnd) {
    console.debug('QUnit runEnd event was triggered.'); // eslint-disable-line no-console
    done(qunitRunEnd);
  });

  if (QUnit.config?.started > 0 && QUnit.config?.queue?.length === 0) {
    console.debug('QUnit.config.started:', QUnit.config?.started); // eslint-disable-line no-console
    console.debug('QUnit.config.queue.length:', QUnit.config?.queue?.length); // eslint-disable-line no-console
    console.debug('QUnit.config.pq.finished:', QUnit.config?.pq?.finished); // eslint-disable-line no-console
    done();
  }

  /**
   * Automatically tries to start QUnit after a configured delay if it is not already running.
   */
  async function startQunit(): Promise<void> {
    let started = false;

    if (window.QUnit?.config?.autostart !== false) {
      return;
    }
    if (window.QUnit.config.started > 0) {
      return;
    }
    if (!window.QUnit.start) {
      return;
    }
    const naturalRunStartPromise = new Promise<void>((resolve) => {
      QUnit.on('runStart', () => {
        if (!started) {
          console.debug('QUnit started by itself'); // eslint-disable-line no-console
          started = true;
          resolve();
        }
      })
    });
    const automaticRunStartPromise = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        if (!started) {
          console.debug('QUnit started automatically by service'); // eslint-disable-line no-console
          window.QUnit.start();
          resolve();
        }
      }, autostartDelay)
    });
    return Promise.race([naturalRunStartPromise, automaticRunStartPromise]);
  }

  console.debug('Starting QUnit if necessary...'); // eslint-disable-line no-console
  await startQunit();
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
async function getQUnitResults(this: WebdriverIO.Browser, options: WdioQunitService.ServiceOption): Promise<WdioQunitService.RunEndDetails> {
  log.info('Getting QUnit results...');
  const qunitResults = await qunitHooks(this, options);
  generateTestCases(qunitResults);
  return qunitResults;
}

export default class QUnitService implements Services.ServiceInstance {
  static defaultOptions: Required<Pick<WdioQunitService.ServiceOption, 'paths' | 'autostartDelay'>> = {
    autostartDelay: 100,
    paths: [],
  };
  public options: WdioQunitService.ServiceOption & typeof QUnitService.defaultOptions;
  constructor(options: WdioQunitService.ServiceOption) {
    this.options = {...QUnitService.defaultOptions, ...options};
  }
  before(
      capabilities: Capabilities.RemoteCapability,
      specs: string[],
      browserInstance: WebdriverIO.Browser
  ): void {
    log.debug('Executing before hook...');
    browserInstance.addCommand(
        'getQUnitResults',
        getQUnitResults.bind(browserInstance, this.options)
    );
  }

  beforeSession(config: Omit<WebdriverIO.Config, 'capabilities'>): void {
    log.debug('Executing beforeSession hook...');
    const serviceConfig = this.options;
    const files = getQUnitHtmlFiles(serviceConfig.paths, config?.baseUrl);
    if (files.length > 0) {
      globalThis._WdioQunitServiceHtmlFiles = files;
    }
  }
}

class CustomLauncher implements Services.ServiceInstance {
  constructor(public options: WdioQunitService.ServiceOption) {
  }
  onPrepare(config: WebdriverIO.Config): void {
    log.debug('Executing onPrepare launcher...');
    const serviceConfig = this.options;
    const files = getQUnitHtmlFiles(serviceConfig?.paths || [], config?.baseUrl);
    if (files.length > 0) {
      config.specs?.push(join(getDirname(), 'default.test.js'));
    }
  }
}

export {WdioQunitService};
export const launcher = CustomLauncher;
