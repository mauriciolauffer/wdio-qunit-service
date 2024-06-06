describe("QUnit test page", () => {
  it("should pass QUnit tests - LOCAL", async () => {
    await browser.url("http://localhost:8080/test/generic/qunit.html");
    const qunitResults = await browser.getQUnitResults();
    expect(qunitResults).toBeTruthy();
    expect(qunitResults.status).toEqual("passed"); // In case you want to test the overall QUnit status, not really required
  });
});
