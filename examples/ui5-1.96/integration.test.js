describe("QUnit OPA5 integration test page", function () {
  it.skip("should pass Shopping Cart integration tests - REMOTE - UI5 v1.96", async function () {
    // TODO: UI5 test taking too long to run
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/cart/webapp/test/integration/opaTestsComponent.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Browse Orders integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/orderbrowser/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Team Calendar integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/teamCalendar/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Shop Administration Tool integration tests - REMOTE - UI5 v1.96", async function () {
    // TODO: error in UI5 test
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/tnt/demokit/toolpageapp/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Manage Products integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Walkthrough integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/tutorial/walkthrough/37/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Ice Cream Machine integration tests - REMOTE - UI5 v1.96", async function () {
    // TODO: Failing all tests
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/opa/opaTests.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Worklist integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/worklist/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Master-Detail integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/master-detail/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Basic Template integration tests - REMOTE - UI5 v1.96", async function () {
    await browser.url(
      "https://ui5.sap.com/1.96/test-resources/sap/m/demokit/basicTemplate/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });
});
