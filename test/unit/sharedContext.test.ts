import { describe, it, expect } from "vitest";
import { sharedContext } from "../../src/sharedContext.js";

describe("sharedContext", () => {
  it("initialises with an empty qunitHtmlFiles array", () => {
    expect(sharedContext.qunitHtmlFiles).toEqual([]);
  });

  it("allows setting qunitHtmlFiles", () => {
    sharedContext.qunitHtmlFiles = ["http://localhost/test.html"];
    expect(sharedContext.qunitHtmlFiles).toEqual(["http://localhost/test.html"]);
    sharedContext.qunitHtmlFiles = [];
  });
});
