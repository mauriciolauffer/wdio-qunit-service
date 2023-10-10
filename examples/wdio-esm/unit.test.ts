describe('QUnit test page', () => {
  it('should pass QUnit tests - REMOTE', async () => {
    const url = 'https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/unit/unitTests.qunit.html';
    await browser.url(url);
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
  });
});
