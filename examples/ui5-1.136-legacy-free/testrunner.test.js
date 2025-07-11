describe("QUnit TestRunner page", function () {
  it("should pass UI5 QUnit TestRunner - REMOTE - UI5 v.136 legacy free", async function () {
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/ui/qunit/testrunner.html?testpage=/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/testsuite.qunit.html&autostart=true",
    );
    await browser.getQUnitResults();
  });
});
