describe("QUnit TestRunner page", function () {
  it("should pass UI5 QUnit TestRunner - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/ui/qunit/testrunner.html?testpage=/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/testsuite.qunit.html&autostart=true",
    );
    await browser.getQUnitResults();
  });
});
