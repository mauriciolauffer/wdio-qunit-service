QUnit.test("Should pass dummy no module async test 1", (assert) => {
  return new Promise((resolve) => {
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
