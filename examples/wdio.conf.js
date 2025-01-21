export const config = {
  specs: ["./**/*.test.ts", "./**/*.test.js", "./**/*.test.cjs"],

  suites: {
    "ui5-1.96": ["./ui5-1.96/**/*.test.js"],
    "ui5-1.108": ["./ui5-1.108/**/*.test.js"],
    "ui5-1.120": ["./ui5-1.120/**/*.test.js"],
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
        args: ["headless", "disable-gpu", "window-size=1024,768"],
      },
    },
  ],

  logLevel: "warn",
  framework: "mocha",
  reporters: ["spec"],
  waitforTimeout: 120000,

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
    timeout: 120000,
  },
};
