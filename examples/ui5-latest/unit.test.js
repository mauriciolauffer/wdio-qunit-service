describe("QUnit unit test page", function () {
  it("should pass Shopping Cart unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/cart/webapp/test/Test.qunit.html?testsuite=test-resources/sap/m/demokit/cart/webapp/test/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Browse Orders unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/Test.qunit.html?testsuite=test-resources/sap/m/demokit/orderbrowser/webapp/test/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass TypeScript To-Do List unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://sap-samples.github.io/ui5-typescript-helloworld/test/Test.qunit.html?testsuite=test-resources/ui5/typescript/helloworld/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Shop Administration Tool unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/tnt/demokit/toolpageapp/webapp/test/Test.qunit.html?testsuite=test-resources/sap/tnt/demokit/toolpageapp/webapp/test/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Bulletin Board unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/testing/14/webapp/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/bulletinboard/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Manage Products unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/Test.qunit.html?testsuite=test-resources/mycompany/myapp/MyWorklistApp/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Walkthrough unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/m/demokit/tutorial/walkthrough/38/webapp/test/Test.qunit.html?testsuite=test-resources/ui5/walkthrough/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });

  it("should pass Ice Cream Machine unit tests - REMOTE - UI5 latest", async function () {
    await browser.url(
      "https://ui5.sap.com/test-resources/sap/suite/ui/commons/demokit/icecream/webapp/test/Test.qunit.html?testsuite=test-resources/sap/suite/ui/commons/demokit/icecream/testsuite.qunit&test=unit/unitTests",
    );
    await browser.getQUnitResults();
  });
});
