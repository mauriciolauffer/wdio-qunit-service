import { describe, it, expect, vi, beforeEach } from "vitest";
import type WdioQunitService from "../../src/types/wdio.js";

// generateTestCases (called by getQUnitResults) uses Mocha globals injected by WDIO at runtime.
const describeMock = vi.fn((_name: string, fn: () => void) => fn());
const itMock = vi.fn((_name: string, fn?: () => Promise<void>) => fn?.()) as typeof vi.fn & { skip: ReturnType<typeof vi.fn> };
itMock.skip = vi.fn();
const expectMock = vi.fn(() => ({ toEqual: vi.fn(), toBeUndefined: vi.fn() }));
(globalThis as unknown as Record<string, unknown>).describe = describeMock;
(globalThis as unknown as Record<string, unknown>).it = itMock;
(globalThis as unknown as Record<string, unknown>).expect = expectMock;
import type WdioQunitService from "../../src/types/wdio.js";

vi.mock("@wdio/logger", () => ({
  default: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

const { getServiceConfig, getQUnitHtmlFiles, default: QUnitService, launcher: CustomLauncher } =
  await import("../../src/index.js");

describe("getServiceConfig", () => {
  it("returns undefined when services is undefined", () => {
    expect(getServiceConfig(undefined)).toBeUndefined();
  });

  it("returns undefined when services is empty", () => {
    expect(getServiceConfig([])).toBeUndefined();
  });

  it("returns undefined when no qunit entry is present", () => {
    expect(getServiceConfig([["other", { paths: ["/test.html"] }]])).toBeUndefined();
  });

  it("returns undefined when qunit entry has no paths", () => {
    expect(getServiceConfig([["qunit", {}]])).toBeUndefined();
  });

  it("returns undefined when qunit entry has empty paths", () => {
    expect(getServiceConfig([["qunit", { paths: [] }]])).toBeUndefined();
  });

  it("returns the config object when qunit entry with paths is present", () => {
    const config = { paths: ["/test.html"] };
    expect(getServiceConfig([["qunit", config]])).toEqual(config);
  });

  it("ignores non-array entries", () => {
    const config = { paths: ["/test.html"] };
    expect(getServiceConfig(["qunit", ["qunit", config]])).toEqual(config);
  });

  it("picks first matching qunit entry", () => {
    const first = { paths: ["/first.html"] };
    const second = { paths: ["/second.html"] };
    expect(getServiceConfig([["qunit", first], ["qunit", second]])).toEqual(first);
  });
});

describe("getQUnitHtmlFiles", () => {
  it("returns empty array for empty input", () => {
    expect(getQUnitHtmlFiles([])).toEqual([]);
  });

  it("keeps valid absolute URLs", () => {
    const paths = ["http://localhost:8080/test.html"];
    expect(getQUnitHtmlFiles(paths)).toEqual(paths);
  });

  it("keeps valid relative paths when baseUrl is provided", () => {
    const paths = ["/test.html"];
    expect(getQUnitHtmlFiles(paths, "http://localhost:8080")).toEqual(paths);
  });

  it("filters out invalid paths with no baseUrl", () => {
    expect(getQUnitHtmlFiles(["/relative/path.html"])).toEqual([]);
  });

  it("filters out completely invalid strings", () => {
    expect(getQUnitHtmlFiles(["not a url !!!"])).toEqual([]);
  });

  it("handles mix of valid and invalid paths", () => {
    const valid = "http://localhost/test.html";
    expect(getQUnitHtmlFiles([valid, "not a url !!!"])).toEqual([valid]);
  });

  it("keeps multiple valid URLs", () => {
    const paths = ["http://localhost/a.html", "http://localhost/b.html"];
    expect(getQUnitHtmlFiles(paths)).toEqual(paths);
  });
});

describe("QUnitService", () => {
  describe("beforeSession", () => {
    beforeEach(async () => {
      const { sharedContext } = await import("../../src/sharedContext.js");
      sharedContext.qunitHtmlFiles = [];
    });

    it("sets sharedContext.qunitHtmlFiles when valid paths are configured", async () => {
      const { sharedContext } = await import("../../src/sharedContext.js");
      const service = new QUnitService();
      service.beforeSession({
        baseUrl: "http://localhost:8080",
        services: [["qunit", { paths: ["/test.html"] }]],
      } as unknown as Omit<WebdriverIO.Config, "capabilities">);
      expect(sharedContext.qunitHtmlFiles).toEqual(["/test.html"]);
    });

    it("does not modify sharedContext when no services configured", async () => {
      const { sharedContext } = await import("../../src/sharedContext.js");
      const service = new QUnitService();
      service.beforeSession({} as unknown as Omit<WebdriverIO.Config, "capabilities">);
      expect(sharedContext.qunitHtmlFiles).toEqual([]);
    });

    it("does not modify sharedContext when paths produce no valid URLs", async () => {
      const { sharedContext } = await import("../../src/sharedContext.js");
      const service = new QUnitService();
      service.beforeSession({
        services: [["qunit", { paths: ["not a url"] }]],
      } as unknown as Omit<WebdriverIO.Config, "capabilities">);
      expect(sharedContext.qunitHtmlFiles).toEqual([]);
    });

    it("does not modify sharedContext when no paths are configured", async () => {
      const { sharedContext } = await import("../../src/sharedContext.js");
      const service = new QUnitService();
      service.beforeSession({
        services: [["qunit", {}]],
      } as unknown as Omit<WebdriverIO.Config, "capabilities">);
      expect(sharedContext.qunitHtmlFiles).toEqual([]);
    });
  });

  describe("before", () => {
    it("registers getQUnitResults command on browser", async () => {
      const addCommand = vi.fn();
      const on = vi.fn();
      const addInitScript = vi.fn().mockResolvedValue({ on });
      const browserInstance = { addCommand, addInitScript } as unknown as WebdriverIO.Browser;
      (globalThis as unknown as { browser: unknown }).browser = browserInstance;

      const service = new QUnitService();
      await service.before(
        {} as unknown as import("@wdio/types").Capabilities.RequestedMultiremoteCapabilities,
        [],
        browserInstance,
      );

      expect(addCommand).toHaveBeenCalledWith("getQUnitResults", expect.any(Function));
      expect(addInitScript).toHaveBeenCalled();
    });

    it("listens for data events on the init script", async () => {
      const on = vi.fn();
      const addCommand = vi.fn();
      const addInitScript = vi.fn().mockResolvedValue({ on });
      const browserInstance = { addCommand, addInitScript } as unknown as WebdriverIO.Browser;
      (globalThis as unknown as { browser: unknown }).browser = browserInstance;

      const service = new QUnitService();
      await service.before(
        {} as unknown as import("@wdio/types").Capabilities.RequestedMultiremoteCapabilities,
        [],
        browserInstance,
      );

      expect(on).toHaveBeenCalledWith("data", expect.any(Function));
    });

    it("data event handler logs the href", async () => {
      let dataHandler: ((href: string) => void) | undefined;
      const on = vi.fn((event: string, cb: (href: string) => void) => { if (event === "data") dataHandler = cb; });
      const addCommand = vi.fn();
      const addInitScript = vi.fn().mockResolvedValue({ on });
      const browserInstance = { addCommand, addInitScript } as unknown as WebdriverIO.Browser;
      (globalThis as unknown as { browser: unknown }).browser = browserInstance;

      const service = new QUnitService();
      await service.before(
        {} as unknown as import("@wdio/types").Capabilities.RequestedMultiremoteCapabilities,
        [],
        browserInstance,
      );

      // should not throw
      expect(() => dataHandler?.("http://localhost/test.html")).not.toThrow();
    });
  });

  describe("getQUnitResults (browser command)", () => {
    it("waits for QUnit completion and returns results", async () => {
      const suiteReport: WdioQunitService.SuiteReport = {
        suiteId: "s1", completed: true, success: true, runtime: 10,
        name: "http://localhost/test.html", tests: [], childSuites: [],
      };

      const execute = vi.fn().mockResolvedValueOnce(true).mockResolvedValue([suiteReport]);
      const waitUntil = vi.fn(async (fn: () => Promise<unknown>) => { await fn(); });
      const addCommand = vi.fn();
      const on = vi.fn();
      const addInitScript = vi.fn().mockResolvedValue({ on });

      const browserInstance = { addCommand, addInitScript, waitUntil, execute } as unknown as WebdriverIO.Browser;
      (globalThis as unknown as { browser: unknown }).browser = browserInstance;

      const service = new QUnitService();
      await service.before(
        {} as unknown as import("@wdio/types").Capabilities.RequestedMultiremoteCapabilities,
        [],
        browserInstance,
      );

      // extract the registered command and call it bound to the browser instance
      const registeredFn = (addCommand.mock.calls[0] as [string, () => Promise<WdioQunitService.SuiteReport[]>])[1];
      const results = await registeredFn.call(browserInstance);

      expect(waitUntil).toHaveBeenCalled();
      expect(results).toEqual([suiteReport]);
    });
  });
});

describe("CustomLauncher", () => {
  describe("onPrepare", () => {
    it("pushes default.test.js into config.specs when valid paths are configured", () => {
      const specs: string[] = [];
      const config = {
        baseUrl: "http://localhost:8080",
        services: [["qunit", { paths: ["/test.html"] }]],
        specs,
      } as unknown as WebdriverIO.Config;

      const launcher = new CustomLauncher();
      launcher.onPrepare(config);

      expect(specs).toHaveLength(1);
      expect(specs[0]).toMatch(/default\.test\.js$/);
    });

    it("does not modify specs when no paths are configured", () => {
      const specs: string[] = [];
      const config = {
        services: [["qunit", {}]],
        specs,
      } as unknown as WebdriverIO.Config;

      const launcher = new CustomLauncher();
      launcher.onPrepare(config);

      expect(specs).toHaveLength(0);
    });

    it("does not modify specs when services is undefined", () => {
      const specs: string[] = [];
      const config = { specs } as unknown as WebdriverIO.Config;

      const launcher = new CustomLauncher();
      launcher.onPrepare(config);

      expect(specs).toHaveLength(0);
    });
  });
});
