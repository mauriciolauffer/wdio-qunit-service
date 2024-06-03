describe('QUnit test page OPA', () => {
  it('should pass QUnit OPA tests - REMOTE', async () => {
    await browser.url('https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/integration/opaTests.qunit.html');
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual('passed'); // In case you want to test the overall QUnit status, not really required
  });
});
