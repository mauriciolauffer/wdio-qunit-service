describe.skip("QUnit test page OPA", function() {
  it("should pass QUnit v1 OPA tests - LOCAL", async function() {
    await browser.url("http://localhost:8080/test/integration/opaTests.qunit-v1.html");
    await browser.getQUnitResults();
  });

  it("should pass QUnit v2 OPA tests - LOCAL", async function() {
    await browser.url("http://localhost:8080/test/integration/opaTests.qunit.html");
    await browser.getQUnitResults();
  });
});
