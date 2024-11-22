describe("QUnit test page", function() {
  it("should pass QUnit v1 tests - LOCAL", async function() {
    await browser.url("http://localhost:8080/test/generic/qunit-v1.html");
    await browser.getQUnitResults();
  });

  it("should pass QUnit v2 tests - LOCAL", async function() {
    await browser.url("http://localhost:8080/test/generic/qunit-v2.html");
    await browser.getQUnitResults();
  });
});
