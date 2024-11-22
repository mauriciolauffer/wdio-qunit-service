/* global QUnit, sinon */

sap.ui.define([
	"sap/ui/demo/todo/controller/App.controller",
	"sap/ui/model/json/JSONModel"
], (AppController, JSONModel) => {
	"use strict";

	let oAppController;

  function removeCompletedTodos(aTodos) {
    let i = aTodos.length;
    while (i--) {
      const oTodo = aTodos[i];
      if (oTodo.completed) {
        aTodos.splice(i, 1);
      }
    }
  }

	QUnit.module("App.controller.js", {

		beforeEach() {
			oAppController = new AppController();
		},

		afterEach() {
			oAppController.destroy();
		}
	});


	QUnit.test("removeCompletedTodos", (assert) => {
		const aTodos = [{title: "My Todo", completed: false}, {title: "My Todo 2", completed: false}];
    removeCompletedTodos(aTodos);
		assert.deepEqual(aTodos, [{title: "My Todo", completed: false}, {title: "My Todo 2", completed: false}]);

		aTodos[1].completed = true;
    removeCompletedTodos(aTodos);
		assert.deepEqual(aTodos, [{title: "My Todo", completed: false}]);

    const aTodosNested = [aTodos];
    assert.deepEqual(aTodosNested, [[{title: "My Todo", completed: false}]]);

    const mix = [[{x:[1,2,3]}, {z: [{a:"A", b:"B"}]}], {}];
		assert.deepEqual({}, {});
		assert.deepEqual([], []);
    assert.deepEqual([{}], [{}]);
    assert.deepEqual([[{}]], [[{}]]);
    assert.deepEqual(mix, [[{x:[1,2,3]}, {z: [{a:"A", b:"B"}]}], {}]);
	});
});
