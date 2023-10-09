declare global {
  namespace WebdriverIO { // eslint-disable-line @typescript-eslint/no-namespace
    interface Browser {
      getQUnitResults: (arg: string) => Promise<void>
    }
  }

  namespace QUnit { // eslint-disable-line @typescript-eslint/no-namespace
    interface ChildSuite {
      name: string
      tests: TestResult[]
    }
    interface TestResult {
      name: string
      status: string
    }
    interface RunEndDetails {
      childSuites: ChildSuite[],
      fullName: string[],
      name: string,
      runtime: number,
      status: string,
      testCounts: [],
      tests: []
    }
  }

  interface QUnit {
      on(
        eventName: string,
        callback: (details: QUnit.RunEndDetails) => void | Promise<void>,
    ): void
  }
}

export default global;
