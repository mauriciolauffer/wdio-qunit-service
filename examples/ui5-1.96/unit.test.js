describe("QUnit unit test page", function () {
  it("should pass Shopping Cart unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/cart/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Browse Orders unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/orderbrowser/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Manage Products unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Walkthrough unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/tutorial/walkthrough/37/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Ice Cream Machine unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Worklist unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/worklist/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Master-Detail unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/master-detail/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Basic Template unit tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/basicTemplate/webapp/test/unit/unitTests.qunit.html",
    );
    await browser.getQUnitResults();
  });
});
