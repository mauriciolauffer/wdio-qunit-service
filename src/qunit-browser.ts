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

  function createQunitReport() {
    const wdioQunitService: WdioQunitService.Reporter = {
      collect: {
        modules: [],
        tests: [],
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
      for (const qModule of collectedModules) {
        const tests = qModule.tests.map((qTest) => {
          const testDone = collectedTests.find(
            (testDone) => qTest.testId === testDone.testId,
          );
          const assertions = testDone?.assertions.map((assertionDone) => {
            return {
              success: assertionDone.result,
              message: assertionDone.message,
              todo: !!assertionDone.todo,
              stack: assertionDone.result ? undefined : testDone.source,
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
