export const config = {
  specs: [
    './**/*.test.js'
  ],

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
    timeout: 30000
  }
};
