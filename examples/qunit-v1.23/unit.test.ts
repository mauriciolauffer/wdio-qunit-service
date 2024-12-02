describe("QUnit test page", function () {
  it("should pass QUnit tests async without modules - LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-v1.23/qunit-no-modules-async.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass QUnit tests sync without modules - LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-v1.23/qunit-no-modules-sync.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass QUnit tests in modules - LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-v1.23/qunit-modules.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass QUnit tests in nested modules- LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-v1.23/qunit-nested-modules.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass QUnit tests all together now - LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-v1.23/qunit-all.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass QUnit tests tag - LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-v1.23/qunit-tag.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass QUnit assertions - LOCAL", async function () {
    await browser.url(
      "http://localhost:4567/examples/qunit-v1.23/qunit-assertions.html",
    );
    await browser.getQUnitResults();
  });
});
