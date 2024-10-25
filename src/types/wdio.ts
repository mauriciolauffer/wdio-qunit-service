declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace WebdriverIO {
    interface Browser {
      getQUnitResults: () => Promise<WdioQunitService.SuiteReport>;
    }
  }

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
declare namespace WdioQunitService {
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
      assertions: WdioQunitService.AssertionDone[];
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
    todo: boolean;
    actual: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    expected: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    source: string;
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
    testId: string;
    todo: boolean;
  }

  type ServiceOption =
    | WebdriverIO.ServiceOption
    | {
        paths?: string[];
      };

  type SharedContext = {
    qunitHtmlFiles: string[];
  };
}

export default WdioQunitService;
