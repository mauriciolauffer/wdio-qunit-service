// Using all examples from QUnit API help - https://qunitjs.com/api/assert

QUnit.test.skip?.("Should skip this test", (assert) => {
  assert.ok(false, "Ensure the test is not executed");
});

QUnit.test("Should pass assert.closeTo", (assert) => {
  const x = 0.1 + 0.2; // 0.30000000000000004
  // passing: must be between 0.299 and 0.301
  assert.closeTo?.(x, 0.3, 0.001);
  const y = 20.13;
  // passing: must be between 20.05 and 20.15 inclusive
  assert.closeTo?.(y, 20.1, 0.05);
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.deepEqual", (assert) => {
  function makeComplexObject(name, extra, country) {
    var children = new Set();
    children.add("Alice");
    children.add(extra);
    var countryToCapital = { UK: "London" };
    return {
      name: name,
      children: children,
      location: {
        country: country,
        nearestCapital: countryToCapital[country],
      },
    };
  }
  var result = makeComplexObject("Marty", "Bob", "UK");
  // Succeeds!
  // While each object is distinct by strict equality (identity),
  // every property, array, object, etc has equal values.
  assert.deepEqual(result, {
    name: "Marty",
    children: new Set(["Alice", "Bob"]),
    location: { country: "UK", nearestCapital: "London" },
  });
});

QUnit.test("Should pass assert.equal", (assert) => {
  assert.equal(1, "1", "String '1' and number 1 have the same value");
});

QUnit.test("Should pass assert.expect", (assert) => {
  assert.ok(true);
  assert.expect(1);
});

QUnit.test("Should pass assert.false", (assert) => {
  assert.false?.(false, "boolean false");
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.notDeepEqual", (assert) => {
  const result = { foo: "yep" };
  // succeeds, objects are similar but have a different foo value.
  assert.notDeepEqual(result, { foo: "nope" });
});

QUnit.test("Should pass assert.notEqual", (assert) => {
  const result = "2";
  // succeeds, 1 and 2 are different.
  assert.notEqual(result, 1);
});

QUnit.test("Should pass assert.notOk", (assert) => {
  assert.notOk(false, "boolean false");
  assert.notOk("", "empty string");
  assert.notOk(0, "number zero");
  assert.notOk(NaN, "NaN value");
  assert.notOk(null, "null value");
  assert.notOk(undefined, "undefined value");
});

QUnit.test("Should pass assert.notPropContains", (assert) => {
  const result = {
    foo: 0,
    vehicle: {
      timeCircuits: "on",
      fluxCapacitor: "fluxing",
      engine: "running",
    },
    quux: 1,
  };
  // succeeds, property "timeCircuits" is actually "on"
  assert.notPropContains?.(result, {
    vehicle: {
      timeCircuits: "off",
    },
  });

  // succeeds, property "wings" is not in the object
  assert.notPropContains?.(result, {
    vehicle: {
      wings: "flapping",
    },
  });
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.notPropEqual", (assert) => {
  class Foo {
    constructor() {
      this.x = "1";
      this.y = 2;
    }
    walk() {}
    run() {}
  }
  const foo = new Foo();
  // succeeds, only own property values are compared (using strict equality),
  // and property "x" is indeed not equal (string instead of number).
  assert.notPropEqual?.(foo, {
    x: 1,
    y: 2,
  });
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.notStrictEqual", (assert) => {
  const result = "2";
  // succeeds, while the number 2 and string 2 are similar, they are strictly different.
  assert.notStrictEqual(result, 2);
});

QUnit.test("Should pass assert.ok", (assert) => {
  assert.ok(true, "boolean true");
  assert.ok("foo", "non-empty string");
  assert.ok(1, "number one");
});

QUnit.test("Should pass assert.propContains", (assert) => {
  const result = {
    foo: 0,
    vehicle: {
      timeCircuits: "on",
      fluxCapacitor: "fluxing",
      engine: "running",
    },
    quux: 1,
  };
  assert.propContains?.(result, {
    foo: 0,
    vehicle: { fluxCapacitor: "fluxing" },
  });
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.propEqual", (assert) => {
  class Foo {
    constructor() {
      this.x = 1;
      this.y = 2;
    }
    walk() {}
    run() {}
  }
  const foo = new Foo();
  // succeeds, own properties are strictly equal,
  // and inherited properties (such as which constructor) are ignored.
  assert.propEqual?.(foo, {
    x: 1,
    y: 2,
  });
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.rejects", (assert) => {
  assert.rejects?.(Promise.reject("some error"));
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.strictEqual", (assert) => {
  const result = 2;
  assert.strictEqual(result, 2);
});

QUnit.test("Should pass assert.throws", (assert) => {
  assert.throws(function () {
    throw new Error("boo");
  });
});

QUnit.test("Should pass assert.true", (assert) => {
  assert.true?.(true, "boolean true");
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should NOT fail when assert a function", (assert) => {
  assert.notEqual(
    QUnit.test,
    undefined,
    "Ensure it does not fail when assert a functions",
  );
});
