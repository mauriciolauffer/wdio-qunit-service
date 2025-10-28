export const config = {
  specs: [""],
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

  logLevel: "warn",
  framework: "mocha",
  reporters: ["spec"],
  waitforTimeout: 90000, // 90 seconds
  baseUrl: "http://localhost:8080",

  services: [
    [
      "qunit",
      {
        paths: [
          "test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=unit/unitTests",
          "test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=integration/opaTests",
        ],
      },
    ],
  ],
  mochaOpts: {
    ui: "bdd",
    timeout: 90000, // 90 seconds
  },
};
