describe("QUnit test page", function() {
  it("should pass QUnit tests - LOCAL", async () => {
    await browser.url("http://localhost:8080/test/generic/qunit.html");
    await browser.getQUnitResults();
  });
});
