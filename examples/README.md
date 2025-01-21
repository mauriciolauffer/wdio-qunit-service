# Examples

This folder contains examples which are also used for testing. These examples cover multiple QUnit scenarios (eg. async, nested modules) and QUnit versions (eg. v1.18, v2.22). They also cover the usage of `WDIO QUnit Service` with other services (eg. [Static Server](https://www.npmjs.com/package/@wdio/static-server-service), [Code Coverage](https://www.npmjs.com/package/wdio-monocart-service)), and in SAP Fiori / UI5 apps.

## Configuration files (wdio.conf.js)

[wdio.conf.js](wdio.conf.js) contains [specs](https://webdriver.io/docs/configuration#specs) and [suites](https://webdriver.io/docs/configuration#suites) properties allowing to run many combinations of tests. See [WebdriverIO Grouping Test Specs in Suites](https://webdriver.io/docs/organizingsuites#grouping-test-specs-in-suites) and [WDIO Qunit Service config](https://webdriver.io/docs/wdio-qunit-service#with-spec-or-test-files).

[wdio.no-specs.conf.js](wdio.no-specs.conf.js) contains the configuration to run tests without any `.spec` or `.test` file. See [WDIO QUnit Service config](https://webdriver.io/docs/wdio-qunit-service#configuration-only-no-spec-or-test-files). The property [baseUrl](https://webdriver.io/docs/configuration#baseurl) is set, therefore there is no need to repeat `http://localhost:4567` in all `paths` mapped into the service config.

[wdio.features.conf.js](wdio.features.conf.js) is used to test WDIO QUnit Service with other services such as [monocart](https://www.npmjs.com/package/wdio-monocart-service) for code coverage.

## QUnit

All QUnit folders execute the same generic tests, except `qunit-fail` and `qunit-preconfiguration`. The generic folders are used to test `WDIO QUnit Service` with different QUnit versions.

The folder `qunit-fail` will execute tests that fail on purpose, just to see how it's reported back into the service.

The folder `qunit-iframes` will execute QUnit tests in `iframes`, similar to what happens in [UI5 - webapp/test/testsuite.qunit.html](https://ui5.sap.com/#/topic/e1ce1de315994a02bf162f4b3b5a9f09).

The folder `qunit-preconfiguration` will execute tests for [QUnit Preconfiguration](https://qunitjs.com/api/config) method.

## SAP Fiori / SAPUI5 / OpenUI5 / UI5

There are two ways to use QUnit to test SAP Fiori/UI5 apps. Loading the QUnit from an HTML file (like any other regular QUnit usage) or loading it via [Test Starter](https://ui5.sap.com/sdk/#/topic/032be2cb2e1d4115af20862673bedcdb), an UI5 module to orchestrate QUnit and OPA5 tests.

In both cases all `WDIO QUnit Service` features are supported. Using spec/test files or configuration only is an option, pick the one you prefer.

### OpenUI5 Sample App loading QUnit from HTML

The folder `openui5-sample-app-no-specs` loads QUnit and the tests from an HTML file as described here: https://ui5.sap.com/1.120/#/topic/e1ce1de315994a02bf162f4b3b5a9f09

In this scenario, the configuration only (no spec/test files) is used. Therefore, there's just a new file created in the UI5 project, the configuration file [wdio.conf.js](openui5-sample-app-no-specs/webapp/test/wdio.conf.js) itself.

### OpenUI5 Sample App using Test Starter

The folder `openui5-sample-app` loads QUnit and the tests from an HTML file as described here: https://ui5.sap.com/#/topic/e1ce1de315994a02bf162f4b3b5a9f09

In this scenario, spec/test files are used. Three new files are created in the UI5 project, the configuration file [wdio.conf.js](openui5-sample-app/webapp/test/wdio.conf.js), the [unit.test.js](openui5-sample-app/webapp/test/unit/unit.test.js) and the [opa.test.js](openui5-sample-app/webapp/test/integration/opa.test.js).

This method is preferred because it gives more flexibility on which tests should be executed via [suites](https://webdriver.io/docs/organizingsuites/#grouping-test-specs-in-suites). See the suites `unit` and `opa` defined in [wdio.conf.js](openui5-sample-app/webapp/test/wdio.conf.js), the [unit.test.js](openui5-sample-app/webapp/test/unit/unit.test.js). For instance, rather than executing all tests, one could run only unit tests with $ `wdio run ./webapp/test/wdio.conf.js --suite unit`
