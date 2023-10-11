declare global {
  namespace WebdriverIO { // eslint-disable-line @typescript-eslint/no-namespace
    interface Browser {
      getQUnitResults: () => Promise<WdioQunitService.RunEndDetails>;
    }
  }

  interface Window {
    QUnit: QUnit;
  }

  interface QUnit {
      on(eventName: string, callback: (details: WdioQunitService.RunEndDetails) => void | Promise<void>): void;
      config: WdioQunitService.ExtendedConfig;
  }
}

declare module WdioQunitService { // eslint-disable-line @typescript-eslint/no-namespace
  interface ExtendedConfig extends Config {
    started: number;
    stats: string;
    modules: Module[];
    queue: [];
  }

  interface Module {
    name: string;
    suiteReport: SuiteReport;
  }

  interface ChildSuite {
    name: string;
    tests: TestReport[];
  }

  interface SuiteReport {
    name: string;
    tests: TestReport[];
  }

  interface TestReport {
    name: string;
    assertions: AssertionReport[]
  }

  interface AssertionReport {
    message: string;
    passed: boolean;
  }

  interface RunEndDetails {
    childSuites: ChildSuite[];
  }
}

export default WdioQunitService;
