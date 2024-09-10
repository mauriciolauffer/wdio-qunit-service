QUnit.module("QUnit nested module 1", () => {
  QUnit.test("Should pass dummy test", (assert) => {
    assert.ok(true);
  });
});

QUnit.module("QUnit nested module 2", () => {
  QUnit.test("Should pass dummy test 1", (assert) => {
    assert.ok(true);
  });

  QUnit.test("Should pass dummy test 2", (assert) => {
    assert.ok(true);
  });

  QUnit.test("Should pass dummy test 3", (assert) => {
    assert.ok(true);
  });

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
});

QUnit.module("QUnit nested module 3", () => {
  QUnit.module("QUnit double nested module 1", () => {
    QUnit.test("Should pass dummy test 1", (assert) => {
      assert.ok(true);
    });

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
  });
});
