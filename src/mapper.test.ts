import { generateTestCases } from '../src/mapper';
import type { SuiteReport, TestReport } from '@wdio/types/build/Frameworks';
import { describe, it } from '@wdio/globals';

// Mock @wdio/globals
jest.mock('@wdio/globals', () => ({
  describe: jest.fn(),
  it: Object.assign(jest.fn(), {
    skip: jest.fn(),
  }),
}));

// TODO: Import `expect` from `@wdio/globals` once a solution for mocking it is found.
// For now, we'll use a simple mock for `expect`.
const mockExpect = jest.fn().mockReturnValue({
  toEqual: jest.fn(),
  not: {
    toEqual: jest.fn(),
  },
});

// @ts-ignore
global.expect = mockExpect;

describe('generateTestCases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a test case for a passing test within a module', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Module',
      fullName: ['My Module'],
      tests: [
        {
          name: 'My Test',
          fullName: ['My Module', 'My Test'],
          duration: 100,
          success: true,
          skipped: false,
          assertions: [
            {
              success: true,
              message: 'Assertion passed',
            },
          ],
        } as TestReport,
      ],
      suites: [],
      duration: 100,
      skipped: false,
      success: true,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('My Module', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it).toHaveBeenCalledWith('My Test', expect.any(Function));
    // @ts-ignore
    const itCallback = it.mock.calls[0][1];
    itCallback();

    expect(mockExpect).toHaveBeenCalledWith(true);
    expect(mockExpect().toEqual).toHaveBeenCalledWith(true);
  });

  it('should generate a test case for a failing test within a module', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Module',
      fullName: ['My Module'],
      tests: [
        {
          name: 'My Failing Test',
          fullName: ['My Module', 'My Failing Test'],
          duration: 100,
          success: false,
          skipped: false,
          assertions: [
            {
              success: false,
              message: 'Assertion failed',
              expected: 'expectedValue',
              actual: 'actualValue',
            },
          ],
        } as TestReport,
      ],
      suites: [],
      duration: 100,
      skipped: false,
      success: false,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('My Module', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it).toHaveBeenCalledWith('My Failing Test', expect.any(Function));
    // @ts-ignore
    const itCallback = it.mock.calls[0][1];
    itCallback();

    expect(mockExpect).toHaveBeenCalledWith('actualValue');
    expect(mockExpect().toEqual).toHaveBeenCalledWith('expectedValue');
  });

  it('should generate a test case for a skipped test within a module', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Module',
      fullName: ['My Module'],
      tests: [
        {
          name: 'My Skipped Test',
          fullName: ['My Module', 'My Skipped Test'],
          duration: 100,
          success: false,
          skipped: true,
          assertions: [],
        } as TestReport,
      ],
      suites: [],
      duration: 100,
      skipped: true,
      success: false,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('My Module', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it.skip).toHaveBeenCalledWith('My Skipped Test', expect.any(Function));
  });

  it('should generate a test case for a passing test without a module', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Test',
      fullName: ['My Test'],
      tests: [
        {
          name: 'My Test',
          fullName: ['My Test'],
          duration: 100,
          success: true,
          skipped: false,
          assertions: [
            {
              success: true,
              message: 'Assertion passed',
            },
          ],
        } as TestReport,
      ],
      suites: [],
      duration: 100,
      skipped: false,
      success: true,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('Injected WDIO QUnit Reporter', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it).toHaveBeenCalledWith('My Test', expect.any(Function));
    // @ts-ignore
    const itCallback = it.mock.calls[0][1];
    itCallback();

    expect(mockExpect).toHaveBeenCalledWith(true);
    expect(mockExpect().toEqual).toHaveBeenCalledWith(true);
  });

  it('should generate a test case for a failing test without a module', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Failing Test',
      fullName: ['My Failing Test'],
      tests: [
        {
          name: 'My Failing Test',
          fullName: ['My Failing Test'],
          duration: 100,
          success: false,
          skipped: false,
          assertions: [
            {
              success: false,
              message: 'Assertion failed',
              expected: 'expectedValue',
              actual: 'actualValue',
            },
          ],
        } as TestReport,
      ],
      suites: [],
      duration: 100,
      skipped: false,
      success: false,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('Injected WDIO QUnit Reporter', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it).toHaveBeenCalledWith('My Failing Test', expect.any(Function));
    // @ts-ignore
    const itCallback = it.mock.calls[0][1];
    itCallback();

    expect(mockExpect).toHaveBeenCalledWith('actualValue');
    expect(mockExpect().toEqual).toHaveBeenCalledWith('expectedValue');
  });

  it('should generate a test case for a skipped test without a module', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Skipped Test',
      fullName: ['My Skipped Test'],
      tests: [
        {
          name: 'My Skipped Test',
          fullName: ['My Skipped Test'],
          duration: 100,
          success: false,
          skipped: true,
          assertions: [],
        } as TestReport,
      ],
      suites: [],
      duration: 100,
      skipped: true,
      success: false,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('Injected WDIO QUnit Reporter', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it.skip).toHaveBeenCalledWith('My Skipped Test', expect.any(Function));
  });

  it('should generate a test case for an aborted report', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Test',
      fullName: ['My Test'],
      tests: [],
      suites: [],
      duration: 100,
      skipped: false,
      success: false,
      aborted: true,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('Execution Aborted', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it).toHaveBeenCalledWith('Tests aborted due to an error', expect.any(Function));
    // @ts-ignore
    const itCallback = it.mock.calls[0][1];
    itCallback();

    expect(mockExpect).toHaveBeenCalledWith(false);
    expect(mockExpect().toEqual).toHaveBeenCalledWith(true);
  });

  it('should generate a test case for a successful main suite', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Suite',
      fullName: ['My Suite'],
      tests: [],
      suites: [],
      duration: 100,
      skipped: false,
      success: true,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('My Suite', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    // In this case, no 'it' block should be called directly for the suite itself,
    // but the describe block is still created.
    // If there were tests, they would be handled as in other test cases.
    // If the suite is successful, we don't create an extra "success" test.
    expect(it).not.toHaveBeenCalled();
  });

  it('should generate a test case for a failing main suite', () => {
    const mockReport: SuiteReport = {
      id: '1',
      name: 'My Failing Suite',
      fullName: ['My Failing Suite'],
      tests: [],
      suites: [],
      duration: 100,
      skipped: false,
      success: false,
    };

    generateTestCases(mockReport);

    expect(describe).toHaveBeenCalledWith('My Failing Suite', expect.any(Function));
    // @ts-ignore
    const describeCallback = describe.mock.calls[0][1];
    describeCallback();

    expect(it).toHaveBeenCalledWith('should have passed', expect.any(Function));
    // @ts-ignore
    const itCallback = it.mock.calls[0][1];
    itCallback();

    expect(mockExpect).toHaveBeenCalledWith(false);
    expect(mockExpect().toEqual).toHaveBeenCalledWith(true);
  });
});
