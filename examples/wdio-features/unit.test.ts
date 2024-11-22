describe.skip("QUnit test page", function () {
  it("should pass QUnit tests and get code coverage", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/cart/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
    const coverage = await browser.getCoverageReport();
    expect(coverage?.statements?.covered).toBeGreaterThan(0);
  });
});
