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

QUnit.test(
  "Should pass dummy no module async test with object/array assert",
  (assert) => {
    const done = assert.async();
    setTimeout(() => {
      const mix = [[{ x: [1, 2, 3] }, { z: [{ a: "A", b: "B" }] }], {}];
      assert.deepEqual({}, {});
      assert.deepEqual([], []);
      assert.deepEqual([{}], [{}]);
      assert.deepEqual([[{}]], [[{}]]);
      assert.deepEqual(mix, [
        [{ x: [1, 2, 3] }, { z: [{ a: "A", b: "B" }] }],
        {},
      ]);
      done();
    }, 500);
  },
);
