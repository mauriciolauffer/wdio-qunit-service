import QUnitService, { CustomLauncher } from '../src/index';
import { join } from 'node:path';
import { URL } from 'node:url';
import { injectQUnitReport, getQUnitSuiteReport } from '../src/qunit-browser';
import * as sharedContext from '../src/sharedContext';
import { generateTestCases } from '../src/mapper';
import logger from '@wdio/logger';
import { describe, it, expect, beforeEach, afterEach, afterAll, vi } from 'vitest';

const mockLogInstance = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};
vi.mock('@wdio/logger', () => ({
  default: vi.fn(() => mockLogInstance)
}));

vi.mock('node:path', () => ({
  join: vi.fn(),
}));

vi.mock('node:url', () => ({
  URL: vi.fn(),
}));

vi.mock('../src/qunit-browser', () => ({
  injectQUnitReport: vi.fn(),
  getQUnitSuiteReport: vi.fn(),
}));

vi.mock('../src/sharedContext', () => ({
  qunitHtmlFiles: [],
}));

vi.mock('../src/mapper', () => ({
  generateTestCases: vi.fn(),
}));

// mockBrowser will be handled by @wdio/globals mock if needed, or directly passed if generateTestCases expects it.
// For now, assuming 'browser' global is not directly set here but managed by test environment or other mocks.

const log = logger('test'); // This will now use the mocked logger

// Helper function (copy of private getServiceConfig)
const getServiceConfig = (services?: any[][]) => {
  if (!services || !Array.isArray(services)) {
    return undefined;
  }
  return services.flat().find((service: any) => {
    if (Array.isArray(service)) {
      return service[0] === 'qunit';
    }
    return false;
  })?.[1];
};

describe('getServiceConfig', () => {
  it('should return undefined if services is undefined', () => {
    expect(getServiceConfig(undefined)).toBeUndefined();
  });

  it('should return undefined if services is not an array', () => {
    expect(getServiceConfig('not-an-array' as any)).toBeUndefined();
  });

  it('should return undefined if services is empty', () => {
    expect(getServiceConfig([])).toBeUndefined();
  });

  it('should return undefined if no qunit service is found', () => {
    expect(getServiceConfig([['other-service', {}]])).toBeUndefined();
  });

  it('should return the qunit service config if found', () => {
    const qunitConfig = { paths: ['path1'] };
    expect(getServiceConfig([['qunit', qunitConfig]])).toEqual(qunitConfig);
  });

  it('should return the qunit service config when services are nested', () => {
    const qunitConfig = { paths: ['path1'] };
    expect(getServiceConfig([[['qunit', qunitConfig]] as any])).toEqual(qunitConfig);
  });

  it('should return undefined if qunit service is found but has no config', () => {
    expect(getServiceConfig([['qunit']])).toBeUndefined();
  });
});

// Helper function (copy of private getQUnitHtmlFiles)
const getQUnitHtmlFiles = (paths: string[] = [], baseUrl?: string) => {
  const htmlFiles: string[] = [];
  for (const path of paths) {
    try {
      const url = new URL(path, baseUrl);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        htmlFiles.push(url.href);
      } else {
        log.warn(`Invalid QUnit HTML file URL: ${path}`);
      }
    } catch (e) {
      log.warn(`Invalid QUnit HTML file URL: ${path}`);
    }
  }
  return htmlFiles;
};

describe('getQUnitHtmlFiles', () => {
  beforeEach(() => {
    // Reset mocks for URL and log before each test in this describe block
    vi.clearAllMocks(); // Clears all mocks, including logger and URL
    // Re-mock URL specifically for this describe block's needs if necessary
    // For now, relying on the global mock and clearAllMocks
  });

  it('should return an empty array if paths is empty', () => {
    expect(getQUnitHtmlFiles([], 'http://localhost')).toEqual([]);
  });

  it('should return an empty array if paths is undefined', () => {
    expect(getQUnitHtmlFiles(undefined, 'http://localhost')).toEqual([]);
  });

  it('should return fully qualified URLs for valid http/https paths', () => {
    const paths = ['http://example.com/test.html', 'https://example.org/another.html'];
    expect(getQUnitHtmlFiles(paths, 'http://localhost')).toEqual(paths);
  });

  it('should use baseUrl for relative paths', () => {
    (URL as unknown as vi.Mock).mockImplementation((path, base) => {
      if (path === '/test.html' && base === 'http://localhost') {
        return { href: 'http://localhost/test.html', protocol: 'http:' };
      }
      // Fallback for other cases or throw error if unexpected
      throw new Error('Unexpected URL constructor call');
    });
    expect(getQUnitHtmlFiles(['/test.html'], 'http://localhost')).toEqual(['http://localhost/test.html']);
  });

  it('should log a warning and skip invalid URLs (non-http/https)', () => {
    (URL as unknown as vi.Mock).mockImplementation((path) => {
      if (path === 'file:///test.html') {
        return { href: 'file:///test.html', protocol: 'file:' };
      }
      throw new Error('Unexpected URL constructor call for file protocol');
    });
    expect(getQUnitHtmlFiles(['file:///test.html'], 'http://localhost')).toEqual([]);
    expect(mockLogInstance.warn).toHaveBeenCalledWith('Invalid QUnit HTML file URL: file:///test.html');
  });

  it('should log a warning and skip paths that cause URL constructor to throw', () => {
    (URL as unknown as vi.Mock).mockImplementation((path) => {
      if (path === 'invalid-path') {
        throw new Error('Invalid URL');
      }
      // Fallback for other cases or throw error if unexpected
      throw new Error('Unexpected URL constructor call');
    });
    expect(getQUnitHtmlFiles(['invalid-path'], 'http://localhost')).toEqual([]);
    expect(mockLogInstance.warn).toHaveBeenCalledWith('Invalid QUnit HTML file URL: invalid-path');
  });

  it('should handle a mix of valid and invalid paths', () => {
    (URL as unknown as vi.Mock).mockImplementation((path, base) => {
      if (path === 'http://example.com/valid.html') {
        return { href: 'http://example.com/valid.html', protocol: 'http:' };
      }
      if (path === '/relative.html' && base === 'http://localhost') {
        return { href: 'http://localhost/relative.html', protocol: 'http:' };
      }
      if (path === 'invalid-one') {
        throw new Error('Invalid URL');
      }
      if (path === 'ftp://example.com/not-http.html') {
        return { href: 'ftp://example.com/not-http.html', protocol: 'ftp:' };
      }
      // Fallback for other cases or throw error if unexpected
      throw new Error(`Unexpected URL constructor call: path=${path}, base=${base}`);
    });

    const paths = ['http://example.com/valid.html', '/relative.html', 'invalid-one', 'ftp://example.com/not-http.html'];
    const expected = ['http://example.com/valid.html', 'http://localhost/relative.html'];
    expect(getQUnitHtmlFiles(paths, 'http://localhost')).toEqual(expected);
    expect(mockLogInstance.warn).toHaveBeenCalledWith('Invalid QUnit HTML file URL: invalid-one');
    expect(mockLogInstance.warn).toHaveBeenCalledWith('Invalid QUnit HTML file URL: ftp://example.com/not-http.html');
    expect(mockLogInstance.warn).toHaveBeenCalledTimes(2);
  });

  it('should work without a baseUrl if all paths are absolute', () => {
    (URL as unknown as vi.Mock).mockImplementation((path, base) => {
      if (base !== undefined && path !== 'http://example.com/test.html') {
        // This check ensures that if a base URL is unexpectedly passed for absolute URLs, we'd know.
        // However, the URL constructor itself handles this by ignoring `base` if `path` is absolute.
        // So, the more direct test is on the output.
        throw new Error(`Base URL should be undefined for absolute path: ${path}, but got ${base}`);
      }
      if (path === 'http://example.com/test.html') {
        return { href: 'http://example.com/test.html', protocol: 'http:' };
      }
      throw new Error('Unexpected URL constructor call');
    });
    expect(getQUnitHtmlFiles(['http://example.com/test.html'])).toEqual(['http://example.com/test.html']);
  });

  it('should log warning if relative path is given without baseUrl', () => {
    (URL as unknown as vi.Mock).mockImplementation((path, base) => {
      if (path === '/relative.html' && base === undefined) {
        // This simulates the TypeError that would occur if a relative URL is passed without a base.
        throw new TypeError('Invalid URL');
      }
      throw new Error('Unexpected URL constructor call');
    });
    expect(getQUnitHtmlFiles(['/relative.html'])).toEqual([]);
    expect(mockLogInstance.warn).toHaveBeenCalledWith('Invalid QUnit HTML file URL: /relative.html');
  });
});

// Helper function (copy of private getQunitResultsFromBrowser)
const getQunitResultsFromBrowser = async (browserInstance: any) => {
  try {
    await browserInstance.waitUntil(
      async () => {
        const ready = await browserInstance.execute(getQUnitSuiteReport);
        return ready !== null;
      },
      {
        timeoutMsg: 'QUnit test suite was not ready in time',
      },
    );
    return browserInstance.execute(getQUnitSuiteReport);
  } catch (e: any) {
    mockLogInstance.error(`Error getting QUnit results: ${e.message}`);
    return null;
  }
};

describe('getQunitResultsFromBrowser', () => {
  let mockBrowserInstance: any;

  beforeEach(() => {
    mockBrowserInstance = {
      waitUntil: vi.fn(),
      execute: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('should return QUnit suite report when ready', async () => {
    const mockReport = { id: 'report1' };
    mockBrowserInstance.waitUntil.mockImplementation(async (condition: () => Promise<boolean>) => {
      // Simulate condition becoming true
      mockBrowserInstance.execute.mockResolvedValueOnce(true); // for the ready check in waitUntil
      await condition(); // Call the condition
      return true;
    });
    mockBrowserInstance.execute.mockResolvedValueOnce(mockReport); // for the final getQUnitSuiteReport

    const result = await getQunitResultsFromBrowser(mockBrowserInstance);

    expect(result).toEqual(mockReport);
    expect(mockBrowserInstance.waitUntil).toHaveBeenCalledTimes(1);
    expect(mockBrowserInstance.execute).toHaveBeenCalledTimes(2); // Once in waitUntil, once for the result
    expect(mockBrowserInstance.execute).toHaveBeenCalledWith(getQUnitSuiteReport);
  });

  it('should return null and log error if waitUntil times out', async () => {
    const timeoutError = new Error('Timeout');
    mockBrowserInstance.waitUntil.mockRejectedValue(timeoutError);

    const result = await getQunitResultsFromBrowser(mockBrowserInstance);

    expect(result).toBeNull();
    expect(mockLogInstance.error).toHaveBeenCalledWith(`Error getting QUnit results: ${timeoutError.message}`);
    expect(mockBrowserInstance.execute).not.toHaveBeenCalled();
  });

  it('should return null and log error if execute for ready check throws', async () => {
    const executeError = new Error('Execute failed');
    mockBrowserInstance.waitUntil.mockImplementation(async (condition: () => Promise<boolean>) => {
      mockBrowserInstance.execute.mockRejectedValueOnce(executeError); // Error during ready check
      await expect(condition()).rejects.toThrow(executeError.message); // Ensure condition throws
      // Simulate waitUntil catching this and rethrowing or handling as a timeout internally
      // For this test, we assume waitUntil propagates or wraps the error leading to the catch block
      throw new Error('Simulated waitUntil failure due to execute error');
    });


    const result = await getQunitResultsFromBrowser(mockBrowserInstance);

    expect(result).toBeNull();
    expect(mockLogInstance.error).toHaveBeenCalledWith('Error getting QUnit results: Simulated waitUntil failure due to execute error');
  });


  it('should return null and log error if final execute throws', async () => {
    const executeError = new Error('Final Execute failed');
    mockBrowserInstance.waitUntil.mockImplementation(async (condition: () => Promise<boolean>) => {
      mockBrowserInstance.execute.mockResolvedValueOnce(true); // for the ready check in waitUntil
      await condition();
      return true;
    });
    mockBrowserInstance.execute.mockRejectedValueOnce(executeError); // Error during final getQUnitSuiteReport

    // This setup implies that the error from the second execute call (inside the try block, after waitUntil)
    // would be caught by the catch block in getQunitResultsFromBrowser.
    const result = await getQunitResultsFromBrowser(mockBrowserInstance);

    expect(result).toBeNull();
    expect(mockLogInstance.error).toHaveBeenCalledWith(`Error getting QUnit results: ${executeError.message}`);
    expect(mockBrowserInstance.execute).toHaveBeenCalledTimes(2); // Once in waitUntil, once for the (failed) result
  });
});

// This is the function that gets added as a browser command
async function getQUnitResults(this: WebdriverIO.Browser) {
  // @ts-ignore
  const browserInstance = this as WebdriverIO.Browser;
  const htmlFiles = sharedContext.qunitHtmlFiles;

  if (!htmlFiles || htmlFiles.length === 0) {
    mockLogInstance.info('No QUnit HTML files found to test.');
    return;
  }

  for (const filePath of htmlFiles) {
    mockLogInstance.info(`Navigating to QUnit page: ${filePath}`);
    await browserInstance.url(filePath);
    const report = await getQunitResultsFromBrowser(browserInstance); // Using the helper
    if (report) {
      generateTestCases(report);
    } else {
      // Generate a failed test case if the report couldn't be fetched
      generateTestCases({
        id: filePath, // Use filePath as a unique ID for this failure case
        name: `Failed to retrieve QUnit tests from ${filePath}`,
        fullName: [`Failed to retrieve QUnit tests from ${filePath}`],
        tests: [],
        suites: [],
        duration: 0,
        skipped: false,
        success: false,
        aborted: true, // Mark as aborted due to retrieval failure
      });
    }
  }
}

describe('getQUnitResults', () => {
  let mockBrowserInstance: any;
  const originalQunitHtmlFiles = sharedContext.qunitHtmlFiles;

  beforeEach(() => {
    mockBrowserInstance = {
      url: vi.fn().mockResolvedValue(undefined),
      // Add other necessary browser methods if getQunitResultsFromBrowser (helper) uses them
      waitUntil: vi.fn(),
      execute: vi.fn(),
    };
    // @ts-ignore
    getQunitResultsFromBrowser = vi.fn(); // Mock the helper function
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Restore original sharedContext.qunitHtmlFiles if necessary, or manage within tests
    sharedContext.qunitHtmlFiles = originalQunitHtmlFiles;
  });

  it('should log info and return if no HTML files are found', async () => {
    sharedContext.qunitHtmlFiles = [];
    await getQUnitResults.call(mockBrowserInstance);
    expect(mockLogInstance.info).toHaveBeenCalledWith('No QUnit HTML files found to test.');
    expect(mockBrowserInstance.url).not.toHaveBeenCalled();
    expect(getQunitResultsFromBrowser).not.toHaveBeenCalled();
    expect(generateTestCases).not.toHaveBeenCalled();
  });

  it('should navigate to each HTML file and generate test cases for each report', async () => {
    const files = ['http://localhost/test1.html', 'http://localhost/test2.html'];
    sharedContext.qunitHtmlFiles = files;
    const report1 = { id: 'report1', name: 'Test Suite 1', fullName: ['Test Suite 1'], tests: [], suites: [], duration: 0, skipped: false, success: true };
    const report2 = { id: 'report2', name: 'Test Suite 2', fullName: ['Test Suite 2'], tests: [], suites: [], duration: 0, skipped: false, success: true };

    (getQunitResultsFromBrowser as vi.Mock)
      .mockResolvedValueOnce(report1)
      .mockResolvedValueOnce(report2);

    await getQUnitResults.call(mockBrowserInstance);

    expect(mockBrowserInstance.url).toHaveBeenCalledTimes(2);
    expect(mockBrowserInstance.url).toHaveBeenCalledWith(files[0]);
    expect(mockBrowserInstance.url).toHaveBeenCalledWith(files[1]);
    expect(getQunitResultsFromBrowser).toHaveBeenCalledTimes(2);
    expect(getQunitResultsFromBrowser).toHaveBeenNthCalledWith(1, mockBrowserInstance);
    expect(getQunitResultsFromBrowser).toHaveBeenNthCalledWith(2, mockBrowserInstance);
    expect(generateTestCases).toHaveBeenCalledTimes(2);
    expect(generateTestCases).toHaveBeenCalledWith(report1);
    expect(generateTestCases).toHaveBeenCalledWith(report2);
  });

  it('should generate a failed test case if a report cannot be fetched', async () => {
    const file = 'http://localhost/test-fail.html';
    sharedContext.qunitHtmlFiles = [file];
    (getQunitResultsFromBrowser as vi.Mock).mockResolvedValueOnce(null);

    await getQUnitResults.call(mockBrowserInstance);

    expect(mockBrowserInstance.url).toHaveBeenCalledWith(file);
    expect(getQunitResultsFromBrowser).toHaveBeenCalledWith(mockBrowserInstance);
    expect(generateTestCases).toHaveBeenCalledWith({
      id: file,
      name: `Failed to retrieve QUnit tests from ${file}`,
      fullName: [`Failed to retrieve QUnit tests from ${file}`],
      tests: [],
      suites: [],
      duration: 0,
      skipped: false,
      success: false,
      aborted: true,
    });
  });

  it('should handle a mix of successful and failed report fetches', async () => {
    const files = ['http://localhost/success.html', 'http://localhost/fail.html'];
    sharedContext.qunitHtmlFiles = files;
    const successReport = { id: 'success', name: 'Success Suite', fullName: ['Success Suite'], tests: [], suites: [], duration: 0, skipped: false, success: true };

    (getQunitResultsFromBrowser as vi.Mock)
      .mockResolvedValueOnce(successReport)
      .mockResolvedValueOnce(null); // Fail for the second file

    await getQUnitResults.call(mockBrowserInstance);

    expect(generateTestCases).toHaveBeenCalledTimes(2);
    expect(generateTestCases).toHaveBeenCalledWith(successReport);
    expect(generateTestCases).toHaveBeenCalledWith({
      id: files[1],
      name: `Failed to retrieve QUnit tests from ${files[1]}`,
      fullName: [`Failed to retrieve QUnit tests from ${files[1]}`],
      tests: [],
      suites: [],
      duration: 0,
      skipped: false,
      success: false,
      aborted: true,
    });
  });
});

describe('QUnit Framework Service', () => {
  let service: QUnitService;
  let mockBrowserInstance: any;
  let mockScript: any;

  beforeEach(() => {
    service = new QUnitService();
    mockScript = {
      on: vi.fn(),
    };
    mockBrowserInstance = {
      addCommand: vi.fn(),
      addInitScript: vi.fn().mockReturnValue(mockScript),
      // options and config might be accessed, so provide them
      options: {},
      config: {},
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('before', () => {
    it('should add "getQUnitResults" command and init script', () => {
      service.before({}, [], mockBrowserInstance);
      expect(mockBrowserInstance.addCommand).toHaveBeenCalledWith(
        'getQUnitResults',
        expect.any(Function)
      );
      expect(mockBrowserInstance.addInitScript).toHaveBeenCalledWith(injectQUnitReport);
      expect(mockScript.on).toHaveBeenCalledWith('data', expect.any(Function));
    });

    it('should log warning when "data" event is received from init script', () => {
      service.before({}, [], mockBrowserInstance);
      // Simulate the 'data' event being emitted
      // First, get the handler function passed to script.on
      const dataEventHandler = mockScript.on.mock.calls[0][1];
      // Then call it with some mock data
      const mockData = { some: 'data' };
      dataEventHandler(mockData);
      expect(mockLogInstance.warn).toHaveBeenCalledWith(
        `QUnit test suite data: ${JSON.stringify(mockData)}`
      );
    });
  });

  describe('beforeSession', () => {
    it('should populate sharedContext.qunitHtmlFiles from service config and baseUrl', () => {
      const mockConfig = {
        services: [['qunit', { paths: ['/test1.html', 'http://example.com/test2.html'] }]],
        baseUrl: 'http://localhost',
      };
      // Mock URL constructor behavior for this test
      (URL as unknown as vi.Mock).mockImplementation((path, base) => {
        if (path === '/test1.html' && base === 'http://localhost') {
          return { href: 'http://localhost/test1.html', protocol: 'http:' };
        }
        if (path === 'http://example.com/test2.html' && base === 'http://localhost') {
          // The base should be ignored if path is absolute
          return { href: 'http://example.com/test2.html', protocol: 'http:' };
        }
        throw new Error(`Unexpected URL call: path=${path}, base=${base}`);
      });

      service.beforeSession(mockConfig as any, {} as any, {} as any);

      expect(sharedContext.qunitHtmlFiles).toEqual([
        'http://localhost/test1.html',
        'http://example.com/test2.html',
      ]);
    });

    it('should use an empty array if no QUnit service config is found', () => {
      const mockConfig = {
        services: [['other-service', {}]],
        baseUrl: 'http://localhost',
      };
      service.beforeSession(mockConfig as any, {} as any, {} as any);
      expect(sharedContext.qunitHtmlFiles).toEqual([]);
    });

    it('should use an empty array if QUnit service config has no paths', () => {
      const mockConfig = {
        services: [['qunit', {}]], // No paths array
        baseUrl: 'http://localhost',
      };
      service.beforeSession(mockConfig as any, {} as any, {} as any);
      expect(sharedContext.qunitHtmlFiles).toEqual([]);
    });

    it('should handle invalid paths gracefully, resulting in fewer items in sharedContext', () => {
      const mockConfig = {
        services: [['qunit', { paths: ['valid.html', 'invalid-url-throws', 'file:///local.html'] }]],
        baseUrl: 'http://localhost',
      };
      (URL as unknown as vi.Mock).mockImplementation((path, base) => {
        if (path === 'valid.html' && base === 'http://localhost') {
          return { href: 'http://localhost/valid.html', protocol: 'http:' };
        }
        if (path === 'invalid-url-throws') {
          throw new Error('Test error for invalid URL');
        }
        if (path === 'file:///local.html') {
          return { href: 'file:///local.html', protocol: 'file:' }; // Non-HTTP
        }
        throw new Error(`Unexpected URL call: path=${path}, base=${base}`);
      });

      service.beforeSession(mockConfig as any, {} as any, {} as any);
      expect(sharedContext.qunitHtmlFiles).toEqual(['http://localhost/valid.html']);
      expect(mockLogInstance.warn).toHaveBeenCalledWith('Invalid QUnit HTML file URL: invalid-url-throws');
      expect(mockLogInstance.warn).toHaveBeenCalledWith('Invalid QUnit HTML file URL: file:///local.html');
    });
  });
});

describe('CustomLauncher', () => {
  let launcher: CustomLauncher;
  let mockConfig: any;
  const originalQunitHtmlFiles = sharedContext.qunitHtmlFiles; // Save for restoration

  beforeEach(() => {
    launcher = new CustomLauncher();
    mockConfig = {
      services: [['qunit', { paths: ['/test.html'] }]],
      baseUrl: 'http://localhost',
      specs: [],
      // wdio-qunit-service specific config, if any, for CustomLauncher
    };
    // Reset sharedContext.qunitHtmlFiles for each test to avoid leakage
    sharedContext.qunitHtmlFiles = [];
    // Mock path.join
    (join as vi.Mock).mockImplementation((...args) => args.join('/')); // Simple mock for join
    // Mock URL for getQUnitHtmlFiles logic if it's indirectly called
    (URL as unknown as vi.Mock).mockImplementation((path, base) => {
      if (path === '/test.html' && base === 'http://localhost') {
        return { href: 'http://localhost/test.html', protocol: 'http:' };
      }
      // Fallback for other URL constructions if necessary
      return { href: `${base || ''}${path}`, protocol: 'http:'};
    });
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Restore original sharedContext.qunitHtmlFiles after all tests in this describe block
    sharedContext.qunitHtmlFiles = originalQunitHtmlFiles;
  });

  it('should augment config.specs with default.test.js if QUnit HTML files are found', () => {
    // Simulate that beforeSession has run and populated qunitHtmlFiles
    // This is a bit of an integration test for the launcher logic
    // Option 1: Directly set sharedContext.qunitHtmlFiles (simpler)
    sharedContext.qunitHtmlFiles = ['http://localhost/test.html'];
    // Option 2: Call the logic that populates it (more realistic but might be redundant if already tested)
    // const serviceConfig = getServiceConfig(mockConfig.services);
    // if (serviceConfig?.paths) {
    //   sharedContext.qunitHtmlFiles = getQUnitHtmlFiles(serviceConfig.paths, mockConfig.baseUrl);
    // }

    launcher.onPrepare(mockConfig, []);

    // Check that join was called to create the path to default.test.js
    // The exact path depends on the __dirname, so we check if join was called with 'default.test.js'
    expect(join).toHaveBeenCalledWith(expect.stringContaining('src'), '../dist/default.test.js');

    // Check that config.specs was augmented
    // The result of join will be its mock implementation
    expect(mockConfig.specs).toEqual([expect.stringContaining('default.test.js')]);
  });

  it('should not modify config.specs if no QUnit HTML files are found (service config missing paths)', () => {
    mockConfig.services = [['qunit', {}]]; // No paths
    // Ensure qunitHtmlFiles is empty based on this config
    const serviceConfig = getServiceConfig(mockConfig.services);
    if (serviceConfig?.paths) {
      sharedContext.qunitHtmlFiles = getQUnitHtmlFiles(serviceConfig.paths, mockConfig.baseUrl);
    } else {
      sharedContext.qunitHtmlFiles = [];
    }

    launcher.onPrepare(mockConfig, []);
    expect(mockConfig.specs).toEqual([]);
    expect(join).not.toHaveBeenCalledWith(expect.stringContaining('src'), '../dist/default.test.js');
  });

  it('should not modify config.specs if no QUnit service is configured', () => {
    mockConfig.services = []; // No QUnit service
    sharedContext.qunitHtmlFiles = []; // Should be empty

    launcher.onPrepare(mockConfig, []);
    expect(mockConfig.specs).toEqual([]);
    expect(join).not.toHaveBeenCalledWith(expect.stringContaining('src'), '../dist/default.test.js');
  });

  it('should not modify config.specs if QUnit HTML files list is empty (e.g., all paths invalid)', () => {
    mockConfig.services = [['qunit', { paths: ['invalid-path'] }]];
    (URL as unknown as vi.Mock).mockImplementation(() => { throw new Error('Invalid URL'); });
    // Ensure qunitHtmlFiles is empty
    const serviceConfig = getServiceConfig(mockConfig.services);
    if (serviceConfig?.paths) {
      sharedContext.qunitHtmlFiles = getQUnitHtmlFiles(serviceConfig.paths, mockConfig.baseUrl);
    }

    launcher.onPrepare(mockConfig, []);
    expect(mockConfig.specs).toEqual([]);
    expect(join).not.toHaveBeenCalledWith(expect.stringContaining('src'), '../dist/default.test.js');
  });
});
