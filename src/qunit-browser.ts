import type WdioQunitService from "./types/wdio";

/**
 * Closure function to be executed in the Browser context, not in the Nodejs one
 */
export default async function getQUnitReportResults(done: (result: WdioQunitService.RunEndDetails) => void) {
  class QUnitBrowserHandler {
    /**
     * Await for QUnit to be made available in the page
     */
    hasQunitLoaded(): Promise<void> {
      return new Promise((resolve): void => {
        if (window?.QUnit) {
          resolve();
        } else {
          let value = window["QUnit"];
          Object.defineProperty(window, "QUnit", {
            get() {
              return value;
            },
            set(newValue) {
              if (newValue !== value) {
                value = newValue;
                resolve();
              }
            },
          });
        }
      });
    }

    /**
     * Await for QUnit to finish running the tests
     */
    hasQunitFinished(): boolean {
      return (
        !!QUnit.config?.started &&
        QUnit.config?.queue?.length === 0 &&
        (QUnit.config.pq === undefined || !!QUnit.config?.pq?.finished)
      );
    }

    /**
     * Get QUnit version
     */
    getQUnitVersion(): string {
      return QUnit?.version;
    }

    /**
     * Await for QUnit to finish running the tests
     */
    onQunitFinished(): Promise<WdioQunitService.RunEndDetails> {
      return new Promise((resolve) => {
        let placeholder: WdioQunitService.RunEndDetails;
        let eventCalled = false;
        const intervalId = setInterval(() => {
          if (eventCalled) {
            clearInterval(intervalId);
          } else if (this.hasQunitFinished()) {
            console.info("QUnit events |runEnd| and |done| were not called, but execution has finished."); // eslint-disable-line no-console
            console.debug("QUnit.config.started:", QUnit.config?.started); // eslint-disable-line no-console
            console.debug("QUnit.config.queue.length:", QUnit.config?.queue?.length); // eslint-disable-line no-console
            console.debug("QUnit.config.pq.finished:", QUnit.config?.pq?.finished); // eslint-disable-line no-console
            clearInterval(intervalId);
            resolve(placeholder);
          }
        }, 200);
        if (QUnit?.on) {
          QUnit.on("runEnd", function (qunitRunEnd) {
            console.info("QUnit runEnd event was triggered."); // eslint-disable-line no-console
            eventCalled = true;
            clearInterval(intervalId);
            resolve(qunitRunEnd);
          });
        } else {
          QUnit.done(function () {
            console.info("QUnit done event was triggered."); // eslint-disable-line no-console
            eventCalled = true;
            clearInterval(intervalId);
            resolve(placeholder);
          });
        }
      });
    }

    /**
     * Extract QUnit results when QUnit runEnd event is not triggered in v1
     */
    buildSuiteReportQUnitV1(): WdioQunitService.RunEndDetails {
      const elements = document.getElementById("qunit-tests")?.children;
      const modules = buildModules(elements);
      const tests = buildTests(elements);
      return {
        childSuites: modules,
        name: "",
        status: modules.find((module) => module.status === "failed")
          ? "failed"
          : "passed",
        tests: tests.filter((test) => test.suiteName === undefined),
      };

      /**
       * Build modules
       */
      function buildModules(
        elements?: HTMLCollection
      ): WdioQunitService.SuiteReport[] {
        const childSuites: WdioQunitService.SuiteReport[] = [];
        if (!elements) {
          return childSuites;
        }
        for (const node of Array.from(elements)) {
          const moduleName =
            node.querySelector(".module-name")?.textContent || "";
          if (!moduleName) {
            continue;
          }
          const tests = buildTests(elements).filter(
            (test) => test.suiteName === moduleName
          );
          const childSuite: WdioQunitService.SuiteReport = {
            childSuites: [],
            name: moduleName,
            status: tests.find((test) => test.status === "failed")
              ? "failed"
              : "passed",
            tests: tests,
          };
          if (!childSuites.find((module) => module.name === moduleName)) {
            childSuites.push(childSuite);
          }
        }
        return childSuites;
      }

      /**
       * Build tests
       */
      function buildTests(
        elements?: HTMLCollection
      ): WdioQunitService.TestReport[] {
        const tests: WdioQunitService.TestReport[] = [];
        if (!elements) {
          return tests;
        }
        for (const node of Array.from(elements)) {
          const moduleName = node.querySelector(".module-name")?.textContent;
          const testName = node.querySelector(".test-name")?.textContent || "";
          const item: WdioQunitService.TestReport = {
            name: testName,
            suiteName: moduleName,
            status: node.classList.contains("pass") ? "passed" : "failed",
            assertions: buildAsserts(
              node.querySelector(".qunit-assert-list")?.children
            ),
          };
          tests.push(item);
        }
        return tests;
      }

      /**
       * Build asserts
       */
      function buildAsserts(
        elements?: HTMLCollection
      ): WdioQunitService.AssertionReport[] {
        const asserts: WdioQunitService.AssertionReport[] = [];
        if (!elements) {
          return asserts;
        }
        for (const node of Array.from(elements)) {
          const item: WdioQunitService.AssertionReport = {
            passed: node.classList.contains("pass"),
            message: node.querySelector(".test-message")?.textContent || "",
          };
          asserts.push(item);
        }
        return asserts;
      }
    }

    /**
     * Extract QUnit results when QUnit runEnd event is not triggered in V2
     */
    buildSuiteReportQUnitV2(): WdioQunitService.RunEndDetails {
      const qunitResultsFromConfigModules: WdioQunitService.RunEndDetails = {
        name: "",
        status: "",
        childSuites: [],
        tests: [],
      };
      for (const qunitConfigModule of QUnit.config.modules) {
        qunitResultsFromConfigModules.status =
          QUnit.config.stats.all > 0 && QUnit.config.stats.bad === 0
            ? "passed"
            : "failed";
        qunitResultsFromConfigModules.childSuites = [
          ...qunitResultsFromConfigModules.childSuites,
          ...qunitConfigModule.suiteReport.childSuites,
        ];
        qunitResultsFromConfigModules.tests = [
          ...qunitResultsFromConfigModules.tests,
          ...qunitConfigModule.suiteReport.tests,
        ];
      }
      return qunitResultsFromConfigModules;
    }

    /**
     * Extract QUnit results when QUnit runEnd event is not triggered
     */
    async getQUnitSuiteReport(): Promise<WdioQunitService.RunEndDetails> {
      await this.hasQunitLoaded();
      let results = await this.onQunitFinished();
      console.info(`QUnit version ${this.getQUnitVersion()} detected.`);  // eslint-disable-line no-console
      if (!results) {
        results =
          parseInt(this.getQUnitVersion().split(".")[0], 10) > 1
            ? this.buildSuiteReportQUnitV2()
            : this.buildSuiteReportQUnitV1();
      }
      return results;
    }
  }
  const handler = new QUnitBrowserHandler();
  done(await handler.getQUnitSuiteReport());
}
