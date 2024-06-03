describe('QUnit test page', () => {
  it('should pass QUnit tests without modules - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-no-modules.html');
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual('passed'); // In case you want to test the overall QUnit status, not really required
  });

  it('should pass QUnit tests in modules - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-modules.html');
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual('passed'); // In case you want to test the overall QUnit status, not really required
  });

  it('should pass QUnit tests in nested modules- LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-nested-modules.html');
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual('passed'); // In case you want to test the overall QUnit status, not really required
  });

  it('should pass QUnit tests all together now - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-all.html');
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual('passed'); // In case you want to test the overall QUnit status, not really required
  });

  it('should pass QUnit tests tag - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-tag.html');
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual('passed'); // In case you want to test the overall QUnit status, not really required
  });
});
