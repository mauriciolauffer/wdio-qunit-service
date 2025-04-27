export const config = {
  specs: ["./**/wdio-features/*.test.ts"],
  capabilities: [
    {
      browserName: "chrome",
      browserVersion: "stable",
      "goog:chromeOptions": {
        args: ["headless", "disable-gpu", "window-size=1024,768", "no-sandbox"],
      },
    },
  ],

  logLevel: "warn",
  framework: "mocha",
  reporters: ["spec"],
  waitforTimeout: 60000,

  services: [
    "qunit",
    [
      "monocart",
      {
        name: "My WebdriverIO Coverage Report",
        filter: {
          "**/resources/**": false,
          "**/test-resources/**": false,
          "**/test/**": false,
          "**/**": true,
        },
        reports: ["v8", "console-details"],
        outputDir: "./coverage",
      },
    ],
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
