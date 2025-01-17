/* global browser */
describe("QUnit test page", function () {
	"use strict";
	it("should pass integration tests", async function () {
		await browser.url("http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/sap/ui/demo/todo/testsuite.qunit&test=integration/opaTests");
		await browser.getQUnitResults();
	});
});
