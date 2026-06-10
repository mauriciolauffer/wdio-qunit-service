import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@wdio/logger", () => ({
  default: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

// The mapper calls describe/it/it.skip/expect as globals injected by the WDIO test runner.
// We stub them on globalThis so the module can be imported and exercised without a real runner.
const describeMock = vi.fn((name: string, fn: () => void) => fn());
const itMock = vi.fn((_name: string, fn?: () => Promise<void>) => fn?.());
itMock.skip = vi.fn();
const expectMock = vi.fn(() => ({
  toEqual: vi.fn(),
  toBeUndefined: vi.fn(),
}));

(globalThis as unknown as Record<string, unknown>).describe = describeMock;
(globalThis as unknown as Record<string, unknown>).it = itMock;
(globalThis as unknown as Record<string, unknown>).expect = expectMock;

const { generateTestCases } = await import("../../src/mapper.js");

import type WdioQunitService from "../../src/types/wdio.js";

function makeAssertion(
  overrides?: Partial<WdioQunitService.AssertionReport>,
): WdioQunitService.AssertionReport {
  return {
    message: "assert ok",
    success: true,
    todo: false,
    actual: true,
    expected: true,
    source: "",
    negative: false,
    ...overrides,
  };
}

function makeTest(overrides?: Partial<WdioQunitService.TestReport>): WdioQunitService.TestReport {
  return {
    testId: "t1",
    suiteName: "Module",
    name: "my test",
    success: true,
    skipped: false,
    runtime: 10,
    assertions: [makeAssertion()],
    ...overrides,
  };
}

function makeChildSuite(
  overrides?: Partial<WdioQunitService.ChildSuite>,
): WdioQunitService.ChildSuite {
  return {
    name: "Module A",
    success: true,
    runtime: 20,
    tests: [makeTest()],
    childSuites: [],
    ...overrides,
  };
}

function makeSuiteReport(
  overrides?: Partial<WdioQunitService.SuiteReport>,
): WdioQunitService.SuiteReport {
  return {
    suiteId: "s1",
    completed: true,
    success: true,
    runtime: 50,
    name: "http://localhost/test.html",
    tests: [],
    childSuites: [],
    ...overrides,
  };
}

describe("generateTestCases", () => {
  beforeEach(() => {
    describeMock.mockClear();
    itMock.mockClear();
    itMock.skip.mockClear();
    expectMock.mockClear();
  });

  it("always creates the 'Injected WDIO QUnit Reporter' describe block", () => {
    generateTestCases(makeSuiteReport());
    const names = describeMock.mock.calls.map(([name]) => name);
    expect(names).toContain("Injected WDIO QUnit Reporter");
  });

  it("creates a describe block for each child suite", () => {
    const suite = makeSuiteReport({ childSuites: [makeChildSuite({ name: "Module A" })] });
    generateTestCases(suite);
    const names = describeMock.mock.calls.map(([name]) => name);
    expect(names).toContain("Module A");
  });

  it("creates an it block for each test in a child suite", () => {
    const test = makeTest({ name: "my test" });
    const suite = makeSuiteReport({ childSuites: [makeChildSuite({ tests: [test] })] });
    generateTestCases(suite);
    const itNames = itMock.mock.calls.map(([name]) => name);
    expect(itNames).toContain("my test");
  });

  it("uses it.skip for skipped tests", () => {
    const test = makeTest({ skipped: true, name: "skipped test" });
    const suite = makeSuiteReport({ childSuites: [makeChildSuite({ tests: [test] })] });
    generateTestCases(suite);
    const skipNames = itMock.skip.mock.calls.map(([name]) => name);
    expect(skipNames).toContain("skipped test");
  });

  it("creates a '...' describe block for top-level tests (no module)", () => {
    const test = makeTest({ name: "root test" });
    const suite = makeSuiteReport({ tests: [test] });
    generateTestCases(suite);
    const names = describeMock.mock.calls.map(([name]) => name);
    expect(names).toContain("...");
  });

  it("does not create extra '...' describe block when there are no root-level tests", () => {
    const suite = makeSuiteReport({ tests: [] });
    generateTestCases(suite);
    const names = describeMock.mock.calls.map(([name]) => name);
    const dotBlocks = names.filter((n) => n === "...");
    expect(dotBlocks).toHaveLength(0);
  });

  it("creates 'Execution Aborted' describe block when suite is aborted", () => {
    const suite = makeSuiteReport({ aborted: "something went wrong" });
    generateTestCases(suite);
    const names = describeMock.mock.calls.map(([name]) => name);
    expect(names).toContain("Execution Aborted");
  });

  it("does not create 'Execution Aborted' describe block when suite is not aborted", () => {
    generateTestCases(makeSuiteReport());
    const names = describeMock.mock.calls.map(([name]) => name);
    expect(names).not.toContain("Execution Aborted");
  });

  it("handles nested child suites recursively", () => {
    const inner = makeChildSuite({ name: "Inner Module", childSuites: [] });
    const outer = makeChildSuite({ name: "Outer Module", childSuites: [inner] });
    const suite = makeSuiteReport({ childSuites: [outer] });
    generateTestCases(suite);
    const names = describeMock.mock.calls.map(([name]) => name);
    expect(names).toContain("Outer Module");
    expect(names).toContain("Inner Module");
  });

  it("uses '...' as describe name when child suite has no name", () => {
    const suite = makeSuiteReport({ childSuites: [makeChildSuite({ name: "" })] });
    generateTestCases(suite);
    const names = describeMock.mock.calls.map(([name]) => name);
    expect(names).toContain("...");
  });

  it("executes the body of the it.skip callback for skipped tests", () => {
    const skipBodyMock = vi.fn((_name: string, fn?: () => void) => fn?.());
    itMock.skip = skipBodyMock;
    const test = makeTest({ skipped: true, name: "skipped with body" });
    const suite = makeSuiteReport({ childSuites: [makeChildSuite({ tests: [test] })] });
    generateTestCases(suite);
    expect(skipBodyMock).toHaveBeenCalledWith("skipped with body", expect.any(Function));
  });

  it("calls expect for a failed assertion with negative flag", () => {
    const assertion = makeAssertion({ success: false, negative: true, actual: "a", expected: "b" });
    const test = makeTest({ assertions: [assertion] });
    const suite = makeSuiteReport({ childSuites: [makeChildSuite({ tests: [test] })] });
    generateTestCases(suite);
    expect(expectMock).toHaveBeenCalled();
  });

  it("calls expect for a failed assertion without negative flag", () => {
    const assertion = makeAssertion({
      success: false,
      negative: false,
      actual: "a",
      expected: "b",
    });
    const test = makeTest({ assertions: [assertion] });
    const suite = makeSuiteReport({ childSuites: [makeChildSuite({ tests: [test] })] });
    generateTestCases(suite);
    expect(expectMock).toHaveBeenCalled();
  });
});
