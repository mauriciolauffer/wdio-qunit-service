QUnit.module("Module 1");
QUnit.test("Should pass dummy async test 1", (assert) => {
  return new Promise((resolve) => {
    assert.ok(true);
    setTimeout(resolve, 200);
  });
});

QUnit.test("Should pass dummy async test 2", (assert) => {
  const done = assert.async();
  setTimeout(() => {
    assert.ok(true);
    done();
  }, 500);
});

QUnit.test("Should pass dummy test 1", function (assert) {
  assert.ok(true);
});

QUnit.module("Module 2");
QUnit.test("Should pass dummy test 1", (assert) => {
  assert.ok(true);
});
