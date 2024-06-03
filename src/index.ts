import type {Capabilities, Services} from '@wdio/types';
import type WdioQunitService from './types/wdio';
import logger from '@wdio/logger';

const log = logger('wdio-qunit-service');

/**
 * Use QUnit events to get test results when QUnit run has ended
 */
async function qunitHooks(
    browserInstance: WebdriverIO.Browser
): Promise<WdioQunitService.RunEndDetails> {
  log.debug('Waiting for QUnit to load...');
  await browserInstance.waitUntil(
      () => browserInstance.execute(() => !!window?.QUnit),
      {
        timeout: 60000,
        timeoutMsg: 'QUnit took too long to load.',
        interval: 100
      }
  );
  log.debug('Waiting for QUnit runEnd event...');
  let qunitResults = await browserInstance.executeAsync(
      QunitFinishedEventInBrowserContext
  );
  if (!qunitResults) {
    await browserInstance.waitUntil(
        () => browserInstance.execute(() => {
          return !!QUnit.config?.started && QUnit.config?.queue?.length === 0 && (QUnit.config.pq === undefined || !!QUnit.config?.pq?.finished);
        }),
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
  /* return browserInstance.executeAsync(function(done) {
    QUnit.on('runEnd', function(qunitRunEnd) {
      console.debug('QUnit runEnd event was triggered.'); // eslint-disable-line no-console
      done(qunitRunEnd);
    });

    // Check whether tests have already been completed, QUnit event runEnd won't be triggered
    if (QUnit.config?.started && QUnit.config?.queue?.length === 0) {
      console.debug('QUnit.config.started:', QUnit.config?.started); // eslint-disable-line no-console
      console.debug('QUnit.config.queue.length:', QUnit.config?.queue?.length); // eslint-disable-line no-console
      console.debug('QUnit.config.pq.finished:', QUnit.config?.pq?.finished); // eslint-disable-line no-console
      const qunitResultsFromConfigModules: WdioQunitService.RunEndDetails = {
        status: '',
        childSuites: [],
        tests: []
      };
      for (const qunitConfigModule of QUnit.config.modules) {
        qunitResultsFromConfigModules.status = QUnit.config.stats.all > 0 && QUnit.config.stats.bad === 0 ? 'passed' : 'failed';
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
  }); */
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
  // Check whether tests have already been completed, QUnit event runEnd won't be triggered
  if (QUnit.config?.started > 0 && QUnit.config?.queue?.length === 0) {
    console.debug('QUnit.config.started:', QUnit.config?.started); // eslint-disable-line no-console
    console.debug('QUnit.config.queue.length:', QUnit.config?.queue?.length); // eslint-disable-line no-console
    console.debug('QUnit.config.pq.finished:', QUnit.config?.pq?.finished); // eslint-disable-line no-console
    done();
  }
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
    describe('...', () => {
      convertQunitTests(qunitResults.tests);
    });
  }
}

/**
 * Convert QUnit Modules into 'describe' blocks
 */
function convertQunitModules(
    qunitModules: WdioQunitService.ChildSuite[]
): void {
  for (const qunitChildSuite of qunitModules) {
    log.debug(`Creating "describe" ${qunitChildSuite.name}`);
    describe(qunitChildSuite.name || '...', () => {
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
        expect(qunitAssertion.passed).toEqual(true);
      }
    });
  }
}

export default class QUnitService implements Services.ServiceInstance {
  /**
   * `serviceOptions` contains all options specific to the service
   */
  constructor() {}

  /**
   * Gets executed before test execution begins, add custom command to get QUnit results
   */
  before(
      capabilities: Capabilities.RemoteCapability,
      specs: string[],
      browserInstance: WebdriverIO.Browser
  ): void {
    browserInstance.addCommand(
        'getQUnitResults',
        this.getQUnitResults.bind(browserInstance)
    );
  }

  async getQUnitResults(
      this: WebdriverIO.Browser
  ): Promise<WdioQunitService.RunEndDetails> {
    log.info('Executing qunitHooks...');
    const qunitResults = await qunitHooks(this); // eslint-disable-line no-invalid-this
    generateTestCases(qunitResults);
    return qunitResults;
  }
}

export {WdioQunitService};
