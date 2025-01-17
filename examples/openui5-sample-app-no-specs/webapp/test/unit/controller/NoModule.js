sap.ui.define([], () => {
  "use strict";

  QUnit.test("Should pass dummy no module test 1", (assert) => {
    assert.ok(true);
  });

  QUnit.test("Should pass dummy no module test 2", (assert) => {
    assert.ok(true);
  });

  QUnit.test("Should pass dummy no module async test 1", (assert) => {
    return new Promise(function (resolve, reject) {
      assert.ok(true);
      setTimeout(resolve, 200);
    });
  });

  QUnit.test("Should pass dummy no module async test 2", (assert) => {
    const done = assert.async();
    setTimeout(() => {
      assert.ok(true);
      done();
    }, 500);
  });
});
