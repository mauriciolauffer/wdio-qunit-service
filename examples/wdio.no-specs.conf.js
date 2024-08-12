export const config = {
  capabilities: [
    {
      'browserName': 'chrome',
      'goog:chromeOptions': {
        args: ['headless', 'disable-gpu']
      }
    }
  ],

  logLevel: 'warn',
  framework: 'mocha',
  reporters: ['spec'],

  baseUrl: 'http://localhost:4567',
  services: [
    ['qunit', {
      paths: [
        'qunit-tag.html',
        'qunit-modules.html',
        './qunit-no-modules.html'
      ]
    }],
    [
      'static-server',
      {
        folders: [{mount: '/', path: './'}]
      }
    ],
    'devtools'
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
};
