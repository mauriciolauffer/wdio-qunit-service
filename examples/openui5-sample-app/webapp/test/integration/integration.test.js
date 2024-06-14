describe("QUnit test page OPA", function() {
  it("should pass QUnit OPA tests - LOCAL", async () => {
    await browser.url("http://localhost:8080/test/integration/opaTests.qunit.html");
    await browser.getQUnitResults();
  });
});
