describe.skip("QUnit TestRunner page", function () {
  it("should pass UI5 QUnit TestRunner - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/ui/qunit/testrunner.html?testpage=/test-resources/sap/ui/core/qunit/testsuites/testsuite.modular.core.qunit.html&autostart=true",
    );
    await browser.getQUnitResults();
  });
});
