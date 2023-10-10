describe('QUnit test page OPA', () => {
  it('should pass QUnit OPA tests - REMOTE', async () => {
    const url = 'https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/integration/opaTests.qunit.html';
    await browser.url(url);
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
  });
});
