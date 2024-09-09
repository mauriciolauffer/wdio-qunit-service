declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace WebdriverIO {
    interface Browser {
      getQUnitResults: () => Promise<WdioQunitService.SuiteReport>;
    }
  }

  var _WdioQunitServiceHtmlFiles: string[]; // eslint-disable-line no-var
  // var _wdioQunitService: WdioQunitService.Reporter; // eslint-disable-line no-var

  interface Window {
    QUnit: QUnit | null | object;
    _wdioQunitService: WdioQunitService.Reporter;
  }

  interface QUnit {
    on(
      eventName: string,
      callback: (details: WdioQunitService.SuiteReport) => void | Promise<void>,
    ): void;
    config: WdioQunitService.ExtendedConfig;
  }
}

// eslint-disable-next-line
declare module WdioQunitService {
  interface ExtendedConfig extends Config {
    started: number;
    stats: Stats;
    modules: Module[];
    queue: [];
    pq: ProcessingQueue;
  }

  interface Reporter {
    collect: {
      modules: WdioQunitService.ModuleDone[];
      tests: WdioQunitService.TestDone[];
    };
    suiteReport: WdioQunitService.SuiteReport;
  }

  interface ProcessingQueue {
    finished: boolean;
  }

  interface Stats {
    all: number;
    bad: number;
  }

  interface Module {
    name: string;
    stats: {
      all: number;
      bad: number;
    };
    suiteReport: SuiteReport;
  }

  interface SuiteReport {
    completed: boolean;
    success: boolean;
    runtime: number;
    name: string;
    tests: TestReport[];
    childSuites: ChildSuite[];
  }

  interface ChildSuite {
    name: string;
    success: boolean;
    runtime: number;
    tests: TestReport[];
    childSuites: ChildSuite[];
  }

  interface TestReport {
    testId: string;
    suiteName: string;
    name: string;
    success: boolean;
    runtime: number;
    assertions: AssertionReport[];
  }

  interface AssertionReport {
    message: string;
    success: boolean;
    stack: string | undefined;
    todo: boolean;
  }

  interface ModuleDone extends QUnit.ModuleDoneDetails {
    success: boolean;
    tests: TestReport[];
    childSuites: ChildSuite[];
  }

  interface TestDone extends QUnit.TestDoneDetails {
    testId: string;
    success: boolean;
    source: string;
    assertions: AssertionDone[];
  }

  interface AssertionDone extends QUnit.LogDetails {
    todo: boolean;
  }

  type ServiceOption =
    | WebdriverIO.ServiceOption
    | {
        paths?: string[];
      };
}

export default WdioQunitService;
