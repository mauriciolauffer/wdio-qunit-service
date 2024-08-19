export const config = {
  specs: ["./**/*.test.ts", "./**/*.test.js"],
  suites: {
    openui5: ["./openui5-sample-app/**/unit/*.test.js"],
    "wdio-cjs": ["./wdio-cjs/**/*.test.js"],
    "wdio-esm": ["./wdio-esm/**/*.test.ts"],
    "wdio-features": ["./wdio-features/**/*.test.ts"],
    "qunit-v1.18": ["./qunit-v1.18/**/*.test.ts"],
    "qunit-v1.23": ["./qunit-v1.23/**/*.test.ts"],
    "qunit-v2.3": ["./qunit-v2.3/**/*.test.ts"],
    "qunit-v2.10": ["./qunit-v2.10/**/*.test.ts"],
  },
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["headless", "disable-gpu"],
      },
    },
  ],

  logLevel: "warn",
  framework: "mocha",
  reporters: ["spec"],

  services: [
    "qunit",
    [
      "static-server",
      {
        folders: [
          { mount: "/", path: "./" }
        ],
      },
    ],
  ],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
