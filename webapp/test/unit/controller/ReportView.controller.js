/*global QUnit*/

sap.ui.define([
	"ns/zpmorderreportapp/controller/ReportView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ReportView Controller");

	QUnit.test("I should test the ReportView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
