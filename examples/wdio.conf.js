export const config = {
  specs: ["./**/*.test.ts", "./**/*.test.js", "./**/*.test.cjs"],
  suites: {
    "ui5-local": ["./openui5-sample-app/**/test/**/*.test.js"],
    "ui5-1.96": ["./ui5-1.96/**/*.test.js"],
    "ui5-1.108": ["./ui5-1.108/**/*.test.cjs"],
    "ui5-1.120": ["./ui5-1.120/**/*.test.js"],
    "ui5-latest": ["./ui5-latest/**/*.test.ts"],
    "wdio-cjs": ["./wdio-cjs/**/*.test.cjs"],
    "wdio-esm": ["./wdio-esm/**/*.test.ts"],
    "wdio-features": ["./wdio-features/**/*.test.ts"],
    "qunit-v1.18": ["./qunit-v1.18/**/*.test.ts"],
    "qunit-v1.23": ["./qunit-v1.23/**/*.test.ts"],
    "qunit-v2.3": ["./qunit-v2.3/**/*.test.ts"],
    "qunit-v2.10": ["./qunit-v2.10/**/*.test.ts"],
    ui5: [
      "./ui5-1.96/**/*.test.js",
      "./ui5-1.108/**/*.test.cjs",
      "./ui5-1.120/**/*.test.js",
      "./ui5-latest/**/*.test.ts",
      "./wdio-cjs/**/*.test.cjs",
      "./wdio-esm/**/*.test.ts",
      "./wdio-features/**/*.test.ts",
    ],
    qunit: [
      "./qunit-v1.18/**/*.test.ts",
      "./qunit-v1.23/**/*.test.ts",
      "./qunit-v2.3/**/*.test.ts",
      "./qunit-v2.10/**/*.test.ts",
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
