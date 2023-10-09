import type {Services} from '@wdio/types';
import logger from '@wdio/logger';

const log = logger('qunit');

/**
 * Use QUnit events to get test results when QUnit run has ended
 */
async function qunitHooks(browserInstance: WebdriverIO.Browser): Promise<QUnit.RunEndDetails> {
  log.trace('Executing qunitHooks...');
  return browserInstance.executeAsync(function(done) {
    QUnit.on('runEnd', function(qunitRunEnd) {
      done(structuredClone(qunitRunEnd));
    });
  });
}

/**
 * Generate test cases from QUnit results
 */
function generateTestCases(qunitResults: QUnit.RunEndDetails): void {
  log.trace('Executing generateTestCases...');
  for (const qunitChildSuite of qunitResults.childSuites) {
    log.debug(`Creating "describe" ${qunitChildSuite.name}`);
    describe(qunitChildSuite.name, () => {
      for (const qunitTest of qunitChildSuite.tests) {
        log.debug(`Creating "it" ${qunitTest.name}`);
        it(qunitTest.name, () => {
          expect(qunitTest.status).toEqual('passed');
        });
      }
    });
  }
}

export default class QUnitService implements Services.ServiceInstance {
  /**
   * `serviceOptions` contains all options specific to the service
   * e.g. if defined as follows:
   *
   * ```
   * services: [['custom', { foo: 'bar' }]]
   * ```
   *
   * the `serviceOptions` parameter will be: `{ foo: 'bar' }`
   */
  constructor() {}

  /**
   * Add custom command to get QUnit results
   */
  async before(config, capabilities, browserInstance: WebdriverIO.Browser) {
    browserInstance.addCommand('getQUnitResults', async function(): Promise<QUnit.RunEndDetails> {
      const qunitResults = await qunitHooks(browserInstance);
      generateTestCases(qunitResults);
      return qunitResults;
    });
  }
}
