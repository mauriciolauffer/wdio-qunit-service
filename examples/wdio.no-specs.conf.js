export const config = {
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["headless", "disable-gpu", "window-size=1024,768"],
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
          "examples/qunit-v2.10/qunit-all.html",
          "https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/unit/unitTests.qunit.html",
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