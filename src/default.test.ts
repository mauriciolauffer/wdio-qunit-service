import { browser } from "@wdio/globals";
import { sharedContext } from "./sharedContext.js";

sharedContext.qunitHtmlFiles.forEach((path) => {
  describe(`No spec found, including - ${path} - from config`, function () {
    it("should pass QUnit tests", async function () {
      await browser.url(path);
      await browser.getQUnitResults();
    });
  });
});
