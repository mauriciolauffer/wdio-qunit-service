// Using all examples from QUnit API help - https://qunitjs.com/api/assert

QUnit.test("Should pass assert.closeTo", (assert) => {
  const x = 0.1 + 0.2; // 0.30000000000000004
  // passing: must be between 0.299 and 0.301
  assert.closeTo?.(x, 500, 1);
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
    name: "Marty XXXXXX",
    children: new Set(["Alice", "Bob"]),
    location: { country: "UK", nearestCapital: "London" },
  });
});

QUnit.test("Should pass assert.equal", (assert) => {
  assert.equal(1, "2", "String '1' and number 1 have the same value");
});

QUnit.test("Should pass assert.expect", (assert) => {
  assert.ok(true);
  assert.expect(2);
});

QUnit.test("Should pass assert.false", (assert) => {
  assert.false?.(true, "boolean false");
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test.skip?.("Should skip test", (assert) => {
  assert.ok(false);
});

QUnit.test("Should pass assert.notDeepEqual", (assert) => {
  const result = { foo: "yep" };
  // succeeds, objects are similar but have a different foo value.
  assert.ok(true);
  assert.notDeepEqual(result, { foo: "yep" });
});

QUnit.test("Should pass assert.notEqual", (assert) => {
  const result = 2;
  // succeeds, 1 and 2 are different.
  assert.notEqual(result, 2);
});

QUnit.test("Should pass assert.notOk", (assert) => {
  assert.notOk(true, "boolean false");
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
      timeCircuits: "on",
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
    x: "1",
    y: 2,
  });
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.notStrictEqual", (assert) => {
  const result = "2";
  // succeeds, while the number 2 and string 2 are similar, they are strictly different.
  assert.notStrictEqual(result, "2");
});

QUnit.test("Should pass assert.ok", (assert) => {
  assert.ok(false, "boolean true");
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
    foo: 1,
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
    x: 2,
    y: 2,
  });
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test.skip("Should pass assert.rejects", (assert) => {
  assert.rejects?.(Promise.resolve("ERROR"));
  assert.ok(true, "Ensure at least 1 assertion is always present");
});

QUnit.test("Should pass assert.strictEqual", (assert) => {
  const result = 2;
  assert.strictEqual(result, 333);
});

QUnit.test.skip("Should pass assert.throws", (assert) => {
  assert.throws(function () {
    //throw new Error("boo");
  });
});

QUnit.test("Should pass assert.true", (assert) => {
  assert.true?.(false, "boolean true");
  assert.ok(true, "Ensure at least 1 assertion is always present");
});
