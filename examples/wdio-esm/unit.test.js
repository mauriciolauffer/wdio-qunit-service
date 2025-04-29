import { browser } from "@wdio/globals";

describe("QUnit test page", function () {
  it("should pass QUnit tests - REMOTE", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });
});
