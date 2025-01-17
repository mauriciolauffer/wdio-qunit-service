QUnit.test("Should have preconfig", (assert) => {
  assert.deepEqual(QUnit.config.altertitle, false, "altertitle");
  assert.deepEqual(QUnit.config.seed, "d84af39036", "seed");
  assert.deepEqual(QUnit.config.testTimeout, 1000, "testTimeout");
});

setTimeout(() => QUnit.start(), 0);
