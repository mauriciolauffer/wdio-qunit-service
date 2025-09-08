import type WdioQunitService from "./types/wdio.js";

/**
 * Called by WDIO browser.addInitScript to inject custom QUnit Reporter
 */
export function injectQUnitReport(emit: (result: string) => void) {
  if (!window._wdioQunitService) {
    let value: QUnit | null = null;
    Object.defineProperty(window, "QUnit", {
      configurable: true,
      enumerable: true,
      get() {
        return value;
      },
      set(newValue: QUnit) {
        if (newValue !== value) {
          value = newValue;
          // @ts-expect-error: QUnit.log may not exist due to QUnit preconfiguration. See https://qunitjs.com/api/config
          if (value?.log) {
            createQunitReport();
            emit(window.location.href);
          }
        }
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
        suiteId: window.crypto.randomUUID(),
        completed: false,
        success: false,
        runtime: 0,
        name: "",
        tests: [],
        childSuites: [],
      },
      results: [],
    };
    wdioQunitService.results = [wdioQunitService.suiteReport];
    window._wdioQunitService = wdioQunitService;
    setQunitReportParentWindow();
    setQUnitCallbackEvents();
  }

  /**
   * Set QUnit callback events
   */
  function setQUnitCallbackEvents() {
    QUnit.log(function (data) {
      window._wdioQunitService.collect.assertions.push({
        ...(data as WdioQunitService.AssertionDone),
      });
    });
    QUnit.testDone(function (data) {
      window._wdioQunitService.collect.tests.push({
        ...(data as WdioQunitService.TestDone),
      });
    });
    QUnit.moduleDone(function (data) {
      window._wdioQunitService.collect.modules.push({
        ...(data as WdioQunitService.ModuleDone),
      });
    });
    QUnit.done(function () {
      try {
        buildModules();
        setSuiteReport();
      } catch (err) {
        window._wdioQunitService.suiteReport.aborted =
          "An error occured when mapping the QUnit results and the process was aborted. Caused by: " +
          (err as Error).stack;
        // In case of error, set Suite Report in the next tick to ensure the error is processed by QUnit
        setTimeout(() => {
          setSuiteReport();
        }, 10);
        throw err;
      }
    });
  }

  /**
   * Set QUnit Suite Report
   */
  function setSuiteReport() {
    const suiteReport = window._wdioQunitService.suiteReport;
    const collectedTests = window._wdioQunitService.collect.tests;
    suiteReport.name = window.location.href;
    suiteReport.runtime =
      suiteReport.childSuites.reduce((acc, obj) => acc + obj.runtime, 0) +
      suiteReport.tests.reduce((acc, obj) => acc + obj.runtime, 0);
    suiteReport.success =
      collectedTests.filter((test) => test.failed > 0).length === 0;
    suiteReport.completed = true;
    window._wdioQunitService.results = [suiteReport];
    setQunitReportParentWindow();
  }

  /**
   * Build modules for WDIO QUnit Reporter
   */
  function buildModules(): void {
    const suiteReport = window._wdioQunitService.suiteReport;
    const collectedModules = [...window._wdioQunitService.collect.modules];
    for (const qModule of collectedModules) {
      const tests = buildTests(qModule.tests);
      if (qModule.name) {
        suiteReport.childSuites.push({
          childSuites: [],
          name: qModule.name,
          success: qModule.failed === 0,
          runtime: qModule.runtime,
          tests: [...tests],
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
    const collectedTests = [...window._wdioQunitService.collect.tests];
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
        assertions: [...assertions],
      };
    });
  }

  /**
   * Build assertions for WDIO QUnit Reporter
   */
  function buildAssertions(
    qTest: WdioQunitService.TestReport,
  ): WdioQunitService.AssertionReport[] {
    const collectedAssertions = [
      ...window._wdioQunitService.collect.assertions,
    ];
    return collectedAssertions
      .filter((assertionDone) => qTest.testId === assertionDone.testId)
      .map((assertionDone) => {
        return {
          success: assertionDone.result,
          message: assertionDone.message,
          todo: !!assertionDone.todo,
          source: assertionDone.source,
          actual: assertionDone.result ? true : assertionDone.actual,
          expected: assertionDone.result ? true : assertionDone.expected,
          negative: !!assertionDone.negative,
        };
      });
  }

  /**
   * Set QUnit Reporter at window parent in case of tests running in iframe
   */
  function setQunitReportParentWindow() {
    if (window.self !== window.parent) {
      const suiteReport = window._wdioQunitService.suiteReport;
      const parentResults = window.parent?._wdioQunitService?.results;
      if (parentResults) {
        const reportIndex = parentResults.findIndex(
          (result) => result.suiteId === suiteReport.suiteId,
        );
        if (reportIndex >= 0) {
          parentResults[reportIndex] = suiteReport;
        } else {
          parentResults.push(suiteReport);
        }
      } else {
        window.parent._wdioQunitService = window._wdioQunitService;
      }
    }
  }
}

/**
 * Called by WDIO browser.execute to get the custom QUnit Reporter results
 */
export function getQUnitSuiteReport(): WdioQunitService.SuiteReport[] {
  return window._wdioQunitService.results;
}
