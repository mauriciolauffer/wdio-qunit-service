export const config = {
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
          // "https://ui5.sap.com/test-resources/sap/m/demokit/cart/webapp/test/unit/unitTests.qunit.html",
          // "https://ui5.sap.com/test-resources/sap/ui/qunit/testrunner.html?testpage=/test-resources/sap/ui/core/qunit/testsuites/testsuite.modular.core.qunit.html&autostart=true",
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
};
