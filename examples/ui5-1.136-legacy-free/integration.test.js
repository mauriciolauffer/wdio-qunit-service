describe("QUnit OPA5 integration test page", function () {
  it.skip("should pass Shopping Cart integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    // TODO: UI5 test taking too long to run
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/m/demokit/cart/webapp/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/cart/testsuite.qunit&test=integration/opaTestsComponent",
    );
    await browser.getQUnitResults();
  });

  it("should pass Browse Orders integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/m/demokit/orderbrowser/webapp/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/orderbrowser/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Team Calendar integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/m/demokit/teamCalendar/webapp/test/Test.qunit.html?testsuite=test-resources/sap/m/demokit/teamCalendar/webapp/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Shop Administration Tool integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/tnt/demokit/toolpageapp/webapp/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/toolpageapp/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/tnt/demokit/toolpageapp/webapp/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/toolpageapp/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Manage Products integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    // TODO: Maximum call stack size exceeded
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/Test.qunit.html?testsuite=test-resources/mycompany/myapp/MyWorklistApp/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Walkthrough integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/m/demokit/tutorial/walkthrough/38/webapp/test/Test.qunit.html?testsuite=test-resources/ui5/walkthrough/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Ice Cream Machine integration tests - REMOTE - UI5 v1.136-legacy-free", async function () {
    // TODO: Failing all tests
    await browser.url(
      "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/Test.qunit.html?testsuite=test-resources/sap/suite/ui/commons/demokit/icecream/testsuite.qunit&test=opa/opaTests",
    );
    await browser.getQUnitResults();
  });
});
