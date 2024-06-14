describe('QUnit test page', function() {
  it('should pass QUnit tests without modules - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-no-modules.html');
    await browser.getQUnitResults();
  });

  it('should pass QUnit tests in modules - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-modules.html');
    await browser.getQUnitResults();
  });

  it('should pass QUnit tests in nested modules- LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-nested-modules.html');
    await browser.getQUnitResults();
  });

  it('should pass QUnit tests all together now - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-all.html');
    await browser.getQUnitResults();
  });

  it('should pass QUnit tests tag - LOCAL', async () => {
    await browser.url('http://localhost:4567/qunit-tag.html');
    await browser.getQUnitResults();
  });
});
