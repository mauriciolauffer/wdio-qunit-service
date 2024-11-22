QUnit.test("Should pass dummy no module test 1", (assert) => {
  assert.ok(true);
});

QUnit.test("Should pass dummy no module test 2", (assert) => {
  assert.ok(true);
});

QUnit.test(
  "Should pass dummy no module test with object/array assert",
  (assert) => {
    const mix = [[{ x: [1, 2, 3] }, { z: [{ a: "A", b: "B" }] }], {}];
    assert.deepEqual({}, {});
    assert.deepEqual([], []);
    assert.deepEqual([{}], [{}]);
    assert.deepEqual([[{}]], [[{}]]);
    assert.deepEqual(mix, [
      [{ x: [1, 2, 3] }, { z: [{ a: "A", b: "B" }] }],
      {},
    ]);
  },
);
