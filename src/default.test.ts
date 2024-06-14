globalThis?._WdioQunitServiceHtmlFiles?.forEach((path) => {
  describe(`No spec found, including - ${path} - from config`, function() {
    it('should pass QUnit tests', async () => {
      await browser.url(path);
      await browser.getQUnitResults();
    });
  });
});
