describe("QUnit test page", function () {
  it("should pass QUnit flat preconfiguration", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-preconfiguration/qunit-flat-config.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass QUnit object preconfiguration", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-preconfiguration/qunit-object-config.html",
    );
    await browser.getQUnitResults();
  });
});
