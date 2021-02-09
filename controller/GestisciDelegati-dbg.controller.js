sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("vodafone.RepintApprov.repintapproval.controller.GestisciDelegati", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestisciDelegati
		 */
		onInit: function () {
	
			this.getOwnerComponent().getRouter().getRoute("GestisciDelegati").attachPatternMatched(this._onObjectMatched, this);
			
		},

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			
		//	alert("Inside GestisciDelegati");
		},

		handleBack: function (e) {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("object");
			}			
		},

		onPressSave: function (oEvent) {
			var oController = this;
			MessageToast.show(oController.getOwnerComponent().getModel("i18n").getResourceBundle().getText("save"));
		},		
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestisciDelegati
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestisciDelegati
		 */
			// onAfterRendering: function() {
			// }

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestisciDelegati
		 */
		//	onExit: function() {
		//
		//	}

	});

});