exports.config = {
  specs: ['./*.test.js'],

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

  services: [['qunit', { autostartDelay: 1000 }]],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
};
