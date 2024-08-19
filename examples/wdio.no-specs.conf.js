export const config = {
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

  baseUrl: "http://localhost:4567",
  services: [
    [
      "qunit",
      {
        paths: [
          // "./qunit-v1.18/qunit-all.html",
          // "./qunit-v1.23/qunit-all.html",
          "./qunit-v2.3/qunit-all.html",
          // "./qunit-v2.10/qunit-all.html",
        ],
      }
    ],
    [
      "static-server",
      {
        folders: [{ mount: "/", path: "./" }],
      },
    ]
  ],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
