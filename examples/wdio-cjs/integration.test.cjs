describe("QUnit test page OPA", function () {
  it("should pass QUnit OPA tests - REMOTE", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });
});
