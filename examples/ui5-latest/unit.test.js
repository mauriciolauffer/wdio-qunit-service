describe("QUnit unit test page", function () {
  it("should pass Shopping Cart unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/cart/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Browse Orders unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass TypeScript To-Do List unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/sample/TsTodos/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/sample/TsTodos/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Manage Products unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Walkthrough unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/walkthrough/38/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Ice Cream Machine unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });
});
