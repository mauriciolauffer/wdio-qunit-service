/**
 * Await for QUnit to be made available in the page
 */
function hasQunitLoaded() {
  return new Promise((resolve) => {
    if (window?.QUnit) {
      return resolve();
    }
    let value = window["QUnit"];
    Object.defineProperty(window, "QUnit", {
      get() {
        return value;
      },
      set(newValue) {
        if (newValue !== value) {
          value = newValue;
          resolve();
        }
      },
    });
  });
}

/**
 * Await for QUnit to finish running the tests
 */
function hasQunitFinished() {
  return (
    !!QUnit.config?.started &&
    QUnit.config?.queue?.length === 0 &&
    (QUnit.config.pq === undefined || !!QUnit.config?.pq?.finished)
  );
}

/**
 * Get QUnit version
 */
function getQUnitVersion() {
  return QUnit?.version;
}

/**
 * Await for QUnit to finish running the tests
 */
function onQunitFinished() {
  return new Promise((resolve) => {
    let eventCalled = false;
    if (QUnit?.on) {
      QUnit.on("runEnd", function (qunitRunEnd) {
        console.info("QUnit runEnd event was triggered."); // eslint-disable-line no-console
        console.debug(qunitRunEnd); // eslint-disable-line no-console
        eventCalled = true;
        resolve(qunitRunEnd);
      });
    } else {
      QUnit.done(function (details) {
        console.info("QUnit done event was triggered."); // eslint-disable-line no-console
        console.debug(details); // eslint-disable-line no-console
        eventCalled = true;
        resolve();
      });
    }
    const intervalId = setInterval(() => {
      if (hasQunitFinished() && !eventCalled) {
        console.info("QUnit events runEnd and done were not called."); // eslint-disable-line no-console
        console.debug("QUnit.config.started:", QUnit.config?.started); // eslint-disable-line no-console
        console.debug("QUnit.config.queue.length:", QUnit.config?.queue?.length); // eslint-disable-line no-console
        console.debug("QUnit.config.pq.finished:", QUnit.config?.pq?.finished); // eslint-disable-line no-console
        clearInterval(intervalId);
        setTimeout(resolve, 100);
      }
    }, 100);
  });
}

/**
 * Extract QUnit results when QUnit runEnd event is not triggered in v1
 */
function buildSuiteReportQUnitV1() {
  const elements = document.getElementById("qunit-tests")?.children;
  const modules = buildModules(elements);
  const tests = buildTests(elements);
  return {
    childSuites: modules,
    name: "",
    status: modules.find((module) => module.status === "failed")
      ? "failed"
      : "passed",
    tests: tests.filter((test) => test.suiteName === undefined),
  };

/**
 * Build modules
 */
function buildModules(elements) {
    const childSuites = [];
    if (!elements) {
      return childSuites;
    }
    for (const node of Array.from(elements)) {
      const moduleName = node.querySelector(".module-name")?.textContent || "";
      if (!moduleName) {
        continue;
      }
      const tests = buildTests(elements).filter(
        (test) => test.suiteName === moduleName
      );
      const childSuite = {
        childSuites: [],
        name: moduleName,
        status: tests.find((test) => test.status === "failed")
          ? "failed"
          : "passed",
        tests: tests,
      };
      if (!childSuites.find((module) => module.name === moduleName)) {
        childSuites.push(childSuite);
      }
    }
    return childSuites;
  }

/**
 * Build tests
 */
function buildTests(elements) {
    const tests = [];
    if (!elements) {
      return tests;
    }
    for (const node of Array.from(elements)) {
      const moduleName = node.querySelector(".module-name")?.textContent;
      const testName = node.querySelector(".test-name")?.textContent || "";
      const item = {
        name: testName,
        suiteName: moduleName,
        status: node.classList.contains("pass") ? "passed" : "failed",
        assertions: buildAsserts(
          node.querySelector(".qunit-assert-list")?.children
        ),
      };
      tests.push(item);
    }
    return tests;
  }

/**
 * Build asserts
 */
function buildAsserts(elements) {
    const asserts = [];
    if (!elements) {
      return asserts;
    }
    for (const node of Array.from(elements)) {
      const item = {
        passed: node.classList.contains("pass"),
        message: node.querySelector(".test-message")?.textContent || "",
      };
      asserts.push(item);
    }
    return asserts;
  }
}

/**
 * Extract QUnit results when QUnit runEnd event is not triggered in V2
 */
function buildSuiteReportQUnitV2() {
  const qunitResultsFromConfigModules = {
    name: "",
    status: "",
    childSuites: [],
    tests: [],
  };
  for (const qunitConfigModule of QUnit.config.modules) {
    qunitResultsFromConfigModules.status =
      QUnit.config.stats.all > 0 && QUnit.config.stats.bad === 0
        ? "passed"
        : "failed";
    qunitResultsFromConfigModules.childSuites = [
      ...qunitResultsFromConfigModules.childSuites,
      ...qunitConfigModule.suiteReport.childSuites,
    ];
    qunitResultsFromConfigModules.tests = [
      ...qunitResultsFromConfigModules.tests,
      ...qunitConfigModule.suiteReport.tests,
    ];
  }
  console.debug("QUnit runEnd event will not be triggered, manually finishing it."); // eslint-disable-line no-console
  return qunitResultsFromConfigModules;
}

/**
 * Extract QUnit results when QUnit runEnd event is not triggered
 */
async function getQUnitResults() {
  await hasQunitLoaded();
  let results = await onQunitFinished();
  if (!results) {
    results = parseInt(getQUnitVersion().split(".")[0], 10) > 1
    ? buildSuiteReportQUnitV2()
    : buildSuiteReportQUnitV1();
  }
  return results;
}




getQUnitResults().then(console.dir).catch(console.error);
