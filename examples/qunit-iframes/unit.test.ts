describe("QUnit test page", function () {
  it("should pass QUnit running in iframes", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-iframes/qunit-iframes.html",
    );
    await browser.getQUnitResults();
  });
});
