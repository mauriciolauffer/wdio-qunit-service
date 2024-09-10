import type WdioQunitService from "./types/wdio";

/**
 * Called by WDIO browser.addInitScript to inject custom QUnit Reporter
 */
export async function injectQUnitReport(emit: (result: boolean) => void) {
  let value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  Object.defineProperty(window, "QUnit", {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        value = newValue;
        createQunitReport();
      }
      emit(true);
    },
  });

  /**
   * Create a new custom QUnit Reporter
   */
  function createQunitReport() {
    const wdioQunitService: WdioQunitService.Reporter = {
      collect: {
        modules: [],
        tests: [],
        assertions: [],
      },
      suiteReport: {
        completed: false,
        success: false,
        runtime: 0,
        name: "",
        tests: [],
        childSuites: [],
      },
    };
    window._wdioQunitService = wdioQunitService;
    QUnit.log(function (data) {
      window._wdioQunitService.collect.assertions.push(
        data as WdioQunitService.AssertionDone,
      );
    });
    QUnit.testDone(function (data) {
      window._wdioQunitService.collect.tests.push(
        data as WdioQunitService.TestDone,
      );
    });
    QUnit.moduleDone(function (data) {
      window._wdioQunitService.collect.modules.push(
        data as WdioQunitService.ModuleDone,
      );
    });
    QUnit.done(function () {
      const suiteReport = window._wdioQunitService.suiteReport;
      const collectedModules = window._wdioQunitService.collect.modules;
      const collectedTests = window._wdioQunitService.collect.tests;
      const collectedAssertions = window._wdioQunitService.collect.assertions;
      for (const qModule of collectedModules) {
        const tests = qModule.tests.map((qTest) => {
          const testDone = collectedTests.find(
            (testDone) => qTest.testId === testDone.testId,
          );
          const assertions = collectedAssertions
            .filter((ass) => ass.testId === qTest.testId)
            .map((assertionDone) => {
              return {
                success: assertionDone.result,
                message: assertionDone.message,
                todo: !!assertionDone.todo,
                source: assertionDone.source,
                actual: assertionDone.actual,
                expected: assertionDone.expected,
              };
            });
          return {
            name: qTest.name,
            suiteName: testDone?.module,
            success: testDone?.failed === 0,
            runtime: testDone?.runtime,
            assertions: assertions,
          };
        });
        if (qModule.name) {
          suiteReport.childSuites.push({
            childSuites: [],
            name: qModule.name,
            success: qModule.failed === 0,
            runtime: qModule.runtime,
            tests: tests as WdioQunitService.TestReport[],
          });
        } else {
          suiteReport.tests = [
            ...suiteReport.tests,
            ...(tests as WdioQunitService.TestReport[]),
          ];
        }
      }
      suiteReport.name = window.location.href;
      suiteReport.runtime =
        suiteReport.childSuites.reduce((acc, obj) => acc + obj.runtime, 0) +
        suiteReport.tests.reduce((acc, obj) => acc + obj.runtime, 0);
      suiteReport.success =
        collectedTests.filter((test) => test.failed > 0).length === 0;
      suiteReport.completed = true;
    });
  }
}

/**
 * Called by WDIO browser.execute to get the custom QUnit Reporter results
 */
export async function getQUnitSuiteReport(
  done: (result: WdioQunitService.SuiteReport) => void,
) {
  done(window._wdioQunitService.suiteReport);
}
