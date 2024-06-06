describe("QUnit test page OPA", () => {
  it("should pass QUnit OPA tests - LOCAL", async () => {
    await browser.url("http://localhost:8080/test/integration/opaTests.qunit.html");
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
  });
});
