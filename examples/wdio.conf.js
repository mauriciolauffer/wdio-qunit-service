import { cpus } from "node:os";
import { defineConfig } from "@wdio/config";
export const config = defineConfig({
  specs: ["./**/*.test.ts", "./**/*.test.js", "./**/*.test.cjs"],

  suites: {
    "ui5-1.96": ["./ui5-1.96/**/*.test.js"],
    "ui5-1.108": ["./ui5-1.108/**/*.test.js"],
    "ui5-1.120": ["./ui5-1.120/**/*.test.js"],
    "ui5-1.136": ["./ui5-1.136/**/*.test.js"],
    "ui5-latest": ["./ui5-latest/**/*.test.js"],
    "wdio-cjs": ["./wdio-cjs/**/*.test.cjs"],
    "wdio-esm": ["./wdio-esm/**/*.test.js"],
    "wdio-features": ["./wdio-features/**/*.test.ts"],
    "qunit-v1.18": ["./qunit-v1.18/**/*.test.ts"],
    "qunit-v1.23": ["./qunit-v1.23/**/*.test.ts"],
    "qunit-v2.3": ["./qunit-v2.3/**/*.test.ts"],
    "qunit-v2.22": ["./qunit-v2.22/**/*.test.ts"],
    "qunit-iframes": ["./qunit-iframes/unit.test.ts"],
    "qunit-preconfig": ["./qunit-preconfiguration/unit.test.ts"],
    "qunit-fail": ["./qunit-fail/unit.test.ts"],
    "ui5-testrunner": ["./ui5-*/**/testrunner.test.js"],
    "ui5-legacy-free": ["./ui5-*-legacy-free/**/*.test.js"],
    "ui5-opa": ["./ui5-*/**/integration.test.js"],
    "ui5-unit": [
      "./ui5-*/**/unit.test.js",
      "./wdio-*/**/*.test.js",
      "./wdio-*/**/*.test.cjs",
    ],
    ui5: [
      "./ui5-*/**/*.test.js",
      "./wdio-*/**/*.test.js",
      "./wdio-*/**/*.test.cjs",
    ],
    qunit: [
      "./qunit-v*/**/*.test.ts",
      "./qunit-iframes/unit.test.ts",
      "./qunit-preconfiguration/*.test.ts",
    ],
  },

  capabilities: [
    {
      browserName: "chrome",
      browserVersion: "stable",
      "goog:chromeOptions": {
        args: [
          "headless",
          "disable-gpu",
          "window-size=1920,1080",
          "no-sandbox",
        ],
      },
    },
  ],

  maxInstances: cpus().length || 4,
  logLevel: "warn",
  framework: "mocha",
  waitforTimeout: 180000, // 3 minutes

  reporters: [
    "spec",
    [
      "junit",
      {
        outputDir: "./test-results",
        outputFileFormat: function (options) {
          return `results-${options.suite?.[0]}.${options.cid}.${options.capabilities.browserName}.xml`;
        },
      },
    ],
  ],

  services: [
    "qunit",
    [
      "static-server",
      {
        folders: [{ mount: "/", path: "./" }],
      },
    ],
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 600000, // 10 minutes
  },
});
