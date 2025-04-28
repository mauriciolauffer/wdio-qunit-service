import { defineConfig } from "@wdio/config";
export const config = defineConfig({
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
  waitforTimeout: 5000,
  baseUrl: "http://localhost:4567",

  services: [
    [
      "qunit",
      {
        paths: [
          "examples/qunit-v1.18/qunit-all.html",
          "examples/qunit-v1.23/qunit-all.html",
          "examples/qunit-v2.3/qunit-all.html",
          "examples/qunit-v2.22/qunit-all.html",
          "https://ui5.sap.com/1.120/test-resources/sap/m/demokit/orderbrowser/webapp/test/unit/unitTests.qunit.html",
          "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/bulletinboard/testsuite.qunit&test=unit/unitTests",
          "examples/qunit-preconfiguration/qunit-flat-config.html",
          "examples/qunit-preconfiguration/qunit-object-config.html",
          "examples/qunit-iframes/qunit-iframes.html",
        ],
      },
    ],
    [
      "static-server",
      {
        folders: [{ mount: "/", path: "./" }],
      },
    ],
  ],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
});
