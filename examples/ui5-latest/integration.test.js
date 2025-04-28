describe("QUnit OPA5 integration test page", function () {
  it.skip("should pass Shopping Cart integration tests - REMOTE - UI5 latest", async function () {
    // TODO: UI5 test taking too long to run
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/cart/webapp/test/Test.qunit.html?testsuite=test-resources/sap/m/demokit/cart/webapp/test/testsuite.qunit&test=integration/opaTestsComponent",
    );
    await browser.getQUnitResults();
  });

  it("should pass Browse Orders integration tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/Test.qunit.html?testsuite=test-resources/sap/m/demokit/orderbrowser/webapp/test/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Team Calendar integration tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/teamCalendar/webapp/test/Test.qunit.html?testsuite=test-resources%2Fsap%2Fm%2Fdemokit%2FteamCalendar%2Fwebapp%2Ftestsuite.qunit&test=integration%2FopaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Shop Administration Tool integration tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/tnt/demokit/toolpageapp/webapp/test/Test.qunit.html?testsuite=test-resources/sap/tnt/demokit/toolpageapp/webapp/test/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board integration tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/bulletinboard/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Manage Products integration tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/Test.qunit.html?testsuite=test-resources/mycompany/myapp/MyWorklistApp/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Walkthrough integration tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/walkthrough/38/webapp/test/Test.qunit.html?testsuite=test-resources/ui5/walkthrough/testsuite.qunit&test=integration/opaTests",
    );
    await browser.getQUnitResults();
  });

  it.skip("should pass Ice Cream Machine integration tests - REMOTE - UI5 latest", async function () {
    // TODO: Failing all tests
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/opa/opaTests.html",
    );
    await browser.getQUnitResults();
  });
});
