describe('QUnit test page', () => {
  it('should pass QUnit tests - LOCAL', async () => {
    const url = 'http://localhost:8080/test/unit/unitTests.qunit.html';
    await browser.url(url);
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
  });
});
