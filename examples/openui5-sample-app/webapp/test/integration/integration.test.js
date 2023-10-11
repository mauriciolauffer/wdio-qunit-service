describe('QUnit test page OPA', () => {
  it('should pass QUnit OPA tests - LOCAL', async () => {
    const url = 'http://localhost:8080/test/integration/opaTests.qunit.html';
    await browser.url(url);
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
  });
});
