import type WdioQunitService from "./types/wdio";

/**
 * Called by WDIO browser.addInitScript to inject custom QUnit Reporter
 */
export function injectQUnitReport(emit: (result: boolean) => void) {
  if (!window.QUnit) {
    let value: null | QUnit = null;
    Object.defineProperty(window, "QUnit", {
      configurable: true,
      enumerable: true,
      get() {
        return value;
      },
      set(newValue: QUnit) {
        if (newValue !== value) {
          value = newValue;
          createQunitReport();
        }
        emit(true);
      },
    });
  }

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
      const collectedTests = window._wdioQunitService.collect.tests;
      buildModules();
      suiteReport.name = window.location.href;
      suiteReport.runtime =
        suiteReport.childSuites.reduce((acc, obj) => acc + obj.runtime, 0) +
        suiteReport.tests.reduce((acc, obj) => acc + obj.runtime, 0);
      suiteReport.success =
        collectedTests.filter((test) => test.failed > 0).length === 0;
      suiteReport.completed = true;
    });
  }

  /**
   * Build modules for WDIO QUnit Reporter
   */
  function buildModules(): void {
    const suiteReport = window._wdioQunitService.suiteReport;
    const collectedModules = window._wdioQunitService.collect.modules;
    for (const qModule of collectedModules) {
      const tests = buildTests(qModule.tests);
      if (qModule.name) {
        suiteReport.childSuites.push({
          childSuites: [],
          name: qModule.name,
          success: qModule.failed === 0,
          runtime: qModule.runtime,
          tests: tests,
        });
      } else {
        suiteReport.tests = [...suiteReport.tests, ...tests];
      }
    }
  }

  /**
   * Build tests for WDIO QUnit Reporter
   */
  function buildTests(
    qModuleTests: WdioQunitService.TestReport[],
  ): WdioQunitService.TestReport[] {
    const collectedTests = structuredClone(
      window._wdioQunitService.collect.tests,
    );
    return qModuleTests.map((qTest) => {
      const testDone = collectedTests.find(
        (testDone) => qTest.testId === testDone.testId,
      );
      const assertions = buildAssertions(qTest);
      return {
        name: qTest.name,
        testId: qTest.testId,
        suiteName: testDone?.module ?? "",
        success: testDone?.failed === 0,
        skipped: !!testDone?.skipped,
        runtime: testDone?.runtime ?? 0,
        assertions: assertions,
      };
    });
  }

  /**
   * Build assertions for WDIO QUnit Reporter
   */
  function buildAssertions(
    qTest: WdioQunitService.TestReport,
  ): WdioQunitService.AssertionReport[] {
    const collectedAssertions = structuredClone(
      window._wdioQunitService.collect.assertions,
    );
    return collectedAssertions
      .filter((assertionDone) => qTest.testId === assertionDone.testId)
      .map((assertionDone) => {
        return {
          success: assertionDone.result,
          message: assertionDone.message,
          todo: !!assertionDone.todo,
          source: assertionDone.source,
          actual: structuredClone(assertionDone.actual),
          expected: structuredClone(assertionDone.expected),
          negative: !!assertionDone.negative,
        };
      });
  }
}

/**
 * Called by WDIO browser.execute to get the custom QUnit Reporter results
 */
export function getQUnitSuiteReport(): WdioQunitService.SuiteReport {
  return window._wdioQunitService.suiteReport;
}
