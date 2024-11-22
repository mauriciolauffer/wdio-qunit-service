describe.skip("QUnit OPA5 integration test page", function () {
  it("should pass Shopping Cart integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/cart/webapp/test/integration/opaTestsComponent.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Browse Orders integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/orderbrowser/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Team Calendar integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/teamCalendar/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Shop Administration Tool integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/tnt/demokit/toolpageapp/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Manage Products integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Walkthrough integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/tutorial/walkthrough/37/webapp/test/integration/opaTests.qunit.html",
    );
    await browser.getQUnitResults();
  });

  it("should pass Ice Cream Machine integration tests - REMOTE - UI5 v1.108", async function () {
    await browser.url(
      "https://ui5.sap.com/1.108/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/opa/opaTests.html",
    );
    await browser.getQUnitResults();
  });
});
