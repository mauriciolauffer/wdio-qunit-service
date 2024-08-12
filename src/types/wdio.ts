declare global {
  namespace WebdriverIO { // eslint-disable-line @typescript-eslint/no-namespace
    interface Browser {
      getQUnitResults: () => Promise<WdioQunitService.RunEndDetails>;
    }
  }

  var _WdioQunitServiceHtmlFiles: string[]; // eslint-disable-line no-var

  interface Window {
    QUnit: QUnit;
  }

  interface QUnit {
    on(
      eventName: string,
      callback: (
        details: WdioQunitService.RunEndDetails
      ) => void | Promise<void>
    ): void;
    config: WdioQunitService.ExtendedConfig;
  }
}

declare module WdioQunitService { // eslint-disable-line
  interface ExtendedConfig extends Config {
    started: number;
    stats: Stats;
    modules: Module[];
    queue: [];
    pq: ProcessingQueue;
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
      all: number,
      bad: number
    }
    suiteReport: SuiteReport;
  }

  interface ChildSuite {
    name: string;
    tests: TestReport[];
    childSuites: ChildSuite[];
  }

  interface SuiteReport {
    status: string | null | undefined,
    name: string;
    tests: TestReport[];
    childSuites: ChildSuite[];
  }

  interface TestReport {
    suiteName: string | null | undefined,
    name: string;
    status: string
    assertions: AssertionReport[];
  }

  interface AssertionReport {
    message: string;
    passed: boolean;
  }

  interface RunEndDetails {
    name: string | null | undefined,
    status: string;
    childSuites: ChildSuite[];
    tests: TestReport[];
  }

  type ServiceOption = (
    WebdriverIO.ServiceOption |
    {
      paths?: string[]
    }
  )
}

export default WdioQunitService;
