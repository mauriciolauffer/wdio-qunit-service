describe("QUnit test page", function () {
  it("should pass unit tests", async function () {
    await browser.url(
      "http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });
});
