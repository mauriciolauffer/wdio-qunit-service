/* global QUnit, sinon*/

sap.ui.define([
], () => {
  "use strict";

  QUnit.module("Test nested modules", {
		beforeEach() {
			this.wdio = true;
		},
		afterEach() {
      this.wdio = null;
		}
	}, function() {
    QUnit.module('QUnit nested module 1', () => {
      QUnit.test('Should pass dummy test 1', (assert) => {
        assert.equal(1, 1);
      });
    });

    QUnit.module('QUnit nested module 2', () => {
      QUnit.test('Should pass dummy test 1', (assert) => {
        assert.equal(1, 1);
      });

      QUnit.test('Should pass dummy test 2', (assert) => {
        assert.equal(1, 1);
      });

      QUnit.test('Should pass dummy test 3', (assert) => {
        assert.equal(1, 1);
      });
    });

    QUnit.module('QUnit nested module 3', () => {
      QUnit.module('QUnit double nested module 1', () => {
        QUnit.test('Should pass dummy test 1', (assert) => {
          assert.equal(1, 1);
        });
      });
    });
  });

});
