export const config = {
  specs: ['./*.test.ts'],

  capabilities: [{
    'browserName': 'chrome',
    'goog:chromeOptions': {
      args: ['headless', 'disable-gpu']
    }
  }],

  logLevel: 'error',
  framework: 'mocha',
  reporters: ['spec'],

  services: ['qunit'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
};
