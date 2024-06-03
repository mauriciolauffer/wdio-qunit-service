describe('QUnit test page', () => {
  it('should pass QUnit tests and get code coverage', async () => {
    await browser.url(
        'https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/unit/unitTests.qunit.html'
    );

    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual('passed'); // In case you want to test the overall QUnit status, not really required

    const coverage = await browser.getCoverageReport();
    expect(coverage?.statements.covered).toBeGreaterThan(0);
  });
});
