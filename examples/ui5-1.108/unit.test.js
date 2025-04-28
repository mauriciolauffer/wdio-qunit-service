describe("QUnit unit test page", function () {
  it("should pass Shopping Cart unit tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/cart/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Browse Orders unit tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/orderbrowser/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass TypeScript To-Do List unit tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/sample/TsTodos/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board unit tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/sample/TsTodos/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Manage Products unit tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Walkthrough unit tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108.38/test-resources/sap/m/demokit/tutorial/walkthrough/37/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Ice Cream Machine unit tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });
});
