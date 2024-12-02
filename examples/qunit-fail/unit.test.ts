describe("QUnit test page", function () {
  it("should fail QUnit assertions - LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-fail/qunit-assertions-fail.html",
    );
    await browser.getQUnitResults();
  });
});
