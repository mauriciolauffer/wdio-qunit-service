describe("QUnit unit test page", function () {
  it.skip("should pass UI5 QUnit TestRunner - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/ui/qunit/testrunner.html?testpage=/test-resources/sap/ui/core/qunit/testsuites/testsuite.modular.core.qunit.html&autostart=true",
    );
    await browser.getQUnitResults();
  });
});
