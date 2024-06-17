describe("QUnit test page", function() {
  it("should pass QUnit tests - LOCAL", async function() {
    await browser.url("http://localhost:8080/test/unit/unitTests.qunit.html");
    await browser.getQUnitResults();
  });
});
