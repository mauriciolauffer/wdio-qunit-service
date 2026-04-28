import { describe, it, expect, beforeEach, vi } from "vitest";
import { getQUnitSuiteReport, injectQUnitReport } from "../../src/qunit-browser.js";
import type WdioQunitService from "../../src/types/wdio.js";

function makeSuiteReport(overrides?: Partial<WdioQunitService.SuiteReport>): WdioQunitService.SuiteReport {
  return {
    suiteId: "test-id",
    completed: true,
    success: true,
    runtime: 100,
    name: "http://localhost/test.html",
    tests: [],
    childSuites: [],
    ...overrides,
  };
}

function makeQUnit(overrides?: Partial<QUnit>): QUnit {
  return {
    log: vi.fn(),
    testDone: vi.fn(),
    moduleDone: vi.fn(),
    done: vi.fn(),
    ...overrides,
  } as unknown as QUnit;
}

function setupWindow() {
  const win = {
    _wdioQunitService: undefined as unknown as WdioQunitService.Reporter,
    QUnit: undefined as QUnit | null,
    crypto: { randomUUID: vi.fn().mockReturnValue("mock-uuid") },
    location: { href: "http://localhost/test.html" },
    self: null as unknown,
    parent: null as unknown,
  };
  win.self = win;
  win.parent = win;
  (globalThis as unknown as { window: unknown }).window = win;
  return win;
}

// The source calls bare `QUnit.log(...)` — a browser global. Mirror window.QUnit onto globalThis.
function assignQUnit(win: ReturnType<typeof setupWindow>, qunit: QUnit) {
  (globalThis as unknown as { QUnit: QUnit }).QUnit = qunit;
  win.QUnit = qunit;
}

describe("getQUnitSuiteReport", () => {
  beforeEach(() => {
    (globalThis as unknown as { window: unknown }).window = undefined;
  });

  it("returns the results array from window._wdioQunitService", () => {
    const report = makeSuiteReport();
    (globalThis as unknown as { window: { _wdioQunitService: WdioQunitService.Reporter } }).window = {
      _wdioQunitService: {
        collect: { modules: [], tests: [], assertions: [] },
        suiteReport: report,
        results: [report],
      },
    };
    expect(getQUnitSuiteReport()).toEqual([report]);
  });

  it("returns multiple results when present", () => {
    const report1 = makeSuiteReport({ suiteId: "id-1", name: "http://localhost/a.html" });
    const report2 = makeSuiteReport({ suiteId: "id-2", name: "http://localhost/b.html" });
    (globalThis as unknown as { window: { _wdioQunitService: WdioQunitService.Reporter } }).window = {
      _wdioQunitService: {
        collect: { modules: [], tests: [], assertions: [] },
        suiteReport: report1,
        results: [report1, report2],
      },
    };
    expect(getQUnitSuiteReport()).toEqual([report1, report2]);
  });
});

describe("injectQUnitReport", () => {
  let win: ReturnType<typeof setupWindow>;
  const emit = vi.fn();

  beforeEach(() => {
    emit.mockClear();
    win = setupWindow();
  });

  it("sets up _wdioQunitService when QUnit is assigned", () => {
    injectQUnitReport(emit);
    assignQUnit(win, makeQUnit());
    expect(win._wdioQunitService).toBeDefined();
    expect(win._wdioQunitService.results).toHaveLength(1);
    expect(win._wdioQunitService.suiteReport.completed).toBe(false);
  });

  it("emits the current href when QUnit is assigned", () => {
    injectQUnitReport(emit);
    assignQUnit(win, makeQUnit());
    expect(emit).toHaveBeenCalledWith("http://localhost/test.html");
  });

  it("does not re-initialise when QUnit is assigned the same value twice", () => {
    injectQUnitReport(emit);
    const qunit = makeQUnit();
    assignQUnit(win, qunit);
    assignQUnit(win, qunit);
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it("does not set up reporter when _wdioQunitService already exists", () => {
    const existing = {} as WdioQunitService.Reporter;
    win._wdioQunitService = existing;
    injectQUnitReport(emit);
    assignQUnit(win, makeQUnit());
    expect(win._wdioQunitService).toBe(existing);
  });

  it("does not emit when QUnit has no .log (preconfigured QUnit)", () => {
    injectQUnitReport(emit);
    assignQUnit(win, makeQUnit({ log: undefined }));
    expect(emit).not.toHaveBeenCalled();
  });

  it("registers QUnit.log, testDone, moduleDone, and done callbacks", () => {
    const qunit = makeQUnit();
    injectQUnitReport(emit);
    assignQUnit(win, qunit);
    expect(qunit.log).toHaveBeenCalled();
    expect(qunit.testDone).toHaveBeenCalled();
    expect(qunit.moduleDone).toHaveBeenCalled();
    expect(qunit.done).toHaveBeenCalled();
  });

  describe("QUnit.done callback (buildModules + setSuiteReport)", () => {
    function getCallbacks(qunit: QUnit) {
      const cbs: Record<string, (...args: unknown[]) => unknown> = {};
      (qunit.log as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.log = cb as (...args: unknown[]) => unknown; });
      (qunit.testDone as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.testDone = cb as (...args: unknown[]) => unknown; });
      (qunit.moduleDone as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.moduleDone = cb as (...args: unknown[]) => unknown; });
      (qunit.done as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.done = cb as (...args: unknown[]) => unknown; });
      return cbs;
    }

    it("marks suiteReport as completed and successful after done fires with no failures", () => {
      const qunit = makeQUnit();
      const cbs = getCallbacks(qunit);
      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      const testDoneData = { testId: "t1", name: "test 1", module: "mod", failed: 0, passed: 1, runtime: 10, skipped: false };
      const moduleDoneData = { name: "mod", failed: 0, passed: 1, runtime: 10, tests: [{ testId: "t1", name: "test 1" }] };

      cbs.testDone(testDoneData);
      cbs.moduleDone(moduleDoneData);
      cbs.done({});

      const report = win._wdioQunitService.suiteReport;
      expect(report.completed).toBe(true);
      expect(report.success).toBe(true);
      expect(report.name).toBe("http://localhost/test.html");
    });

    it("marks suiteReport as failed when any test has failures", () => {
      const qunit = makeQUnit();
      const cbs = getCallbacks(qunit);
      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      const testDoneData = { testId: "t1", name: "test 1", module: "mod", failed: 1, passed: 0, runtime: 10, skipped: false };
      const moduleDoneData = { name: "mod", failed: 1, passed: 0, runtime: 10, tests: [{ testId: "t1", name: "test 1" }] };

      cbs.testDone(testDoneData);
      cbs.moduleDone(moduleDoneData);
      cbs.done({});

      expect(win._wdioQunitService.suiteReport.success).toBe(false);
    });

    it("collects assertions via QUnit.log callback", () => {
      const qunit = makeQUnit();
      const cbs = getCallbacks(qunit);
      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      const assertionData = { testId: "t1", result: true, message: "ok", source: "", actual: true, expected: true, todo: false, negative: false };
      cbs.log(assertionData);

      expect(win._wdioQunitService.collect.assertions).toHaveLength(1);
      expect(win._wdioQunitService.collect.assertions[0]).toMatchObject(assertionData);
    });

    it("adds nameless module tests to suiteReport.tests directly", () => {
      const qunit = makeQUnit();
      const cbs = getCallbacks(qunit);
      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      const testDoneData = { testId: "t1", name: "global test", module: "", failed: 0, passed: 1, runtime: 5, skipped: false };
      const moduleDoneData = { name: "", failed: 0, passed: 1, runtime: 5, tests: [{ testId: "t1", name: "global test" }] };

      cbs.testDone(testDoneData);
      cbs.moduleDone(moduleDoneData);
      cbs.done({});

      expect(win._wdioQunitService.suiteReport.tests).toHaveLength(1);
      expect(win._wdioQunitService.suiteReport.childSuites).toHaveLength(0);
    });

    it("adds named module to childSuites", () => {
      const qunit = makeQUnit();
      const cbs = getCallbacks(qunit);
      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      const testDoneData = { testId: "t2", name: "module test", module: "My Module", failed: 0, passed: 1, runtime: 5, skipped: false };
      const moduleDoneData = { name: "My Module", failed: 0, passed: 1, runtime: 5, tests: [{ testId: "t2", name: "module test" }] };

      cbs.testDone(testDoneData);
      cbs.moduleDone(moduleDoneData);
      cbs.done({});

      expect(win._wdioQunitService.suiteReport.childSuites).toHaveLength(1);
      expect(win._wdioQunitService.suiteReport.childSuites[0].name).toBe("My Module");
    });

    it("marks assertions as failed correctly and preserves actual/expected", () => {
      const qunit = makeQUnit();
      const cbs = getCallbacks(qunit);
      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      const assertionData = { testId: "t3", result: false, message: "not equal", source: "test.js:1", actual: "a", expected: "b", todo: false, negative: false };
      const testDoneData = { testId: "t3", name: "failing test", module: "mod", failed: 1, passed: 0, runtime: 5, skipped: false };
      const moduleDoneData = { name: "mod", failed: 1, passed: 0, runtime: 5, tests: [{ testId: "t3", name: "failing test" }] };

      cbs.log(assertionData);
      cbs.testDone(testDoneData);
      cbs.moduleDone(moduleDoneData);
      cbs.done({});

      const childSuite = win._wdioQunitService.suiteReport.childSuites[0];
      const assertion = childSuite.tests[0].assertions[0];
      expect(assertion.success).toBe(false);
      expect(assertion.actual).toBe("a");
      expect(assertion.expected).toBe("b");
    });

    it("sets assertion actual/expected to true when result is true", () => {
      const qunit = makeQUnit();
      const cbs = getCallbacks(qunit);
      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      const assertionData = { testId: "t4", result: true, message: "ok", source: "", actual: "anything", expected: "anything", todo: false, negative: false };
      const testDoneData = { testId: "t4", name: "passing test", module: "mod", failed: 0, passed: 1, runtime: 5, skipped: false };
      const moduleDoneData = { name: "mod", failed: 0, passed: 1, runtime: 5, tests: [{ testId: "t4", name: "passing test" }] };

      cbs.log(assertionData);
      cbs.testDone(testDoneData);
      cbs.moduleDone(moduleDoneData);
      cbs.done({});

      const assertion = win._wdioQunitService.suiteReport.childSuites[0].tests[0].assertions[0];
      expect(assertion.actual).toBe(true);
      expect(assertion.expected).toBe(true);
    });

    it("propagates results to parent window when running in iframe", () => {
      const parentReport: WdioQunitService.SuiteReport = makeSuiteReport({ suiteId: "other-id" });
      const parent = {
        _wdioQunitService: {
          collect: { modules: [], tests: [], assertions: [] },
          suiteReport: parentReport,
          results: [parentReport],
        } as WdioQunitService.Reporter,
      };
      win.parent = parent;

      const qunit = makeQUnit();
      const cbs: Record<string, (...args: unknown[]) => unknown> = {};
      (qunit.log as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.log = cb as (...args: unknown[]) => unknown; });
      (qunit.testDone as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.testDone = cb as (...args: unknown[]) => unknown; });
      (qunit.moduleDone as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.moduleDone = cb as (...args: unknown[]) => unknown; });
      (qunit.done as ReturnType<typeof vi.fn>).mockImplementation((cb: unknown) => { cbs.done = cb as (...args: unknown[]) => unknown; });

      injectQUnitReport(emit);
      assignQUnit(win, qunit);

      cbs.done({});

      const childSuiteId = win._wdioQunitService.suiteReport.suiteId;
      const pushed = (parent._wdioQunitService.results as WdioQunitService.SuiteReport[]).find(
        (r) => r.suiteId === childSuiteId,
      );
      expect(pushed).toBeDefined();
    });
  });
});
