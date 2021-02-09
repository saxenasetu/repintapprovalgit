sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/TabContainerItem",
	"sap/m/MessageBox",
	'sap/m/library',
	'sap/ui/core/library',
	'sap/ui/core/Core'
], function (Controller, History, MessageToast, JSONModel, TabContainerItem, MessageBox, library, coreLibrary, Core) {
	"use strict";

	var TimePickerMaskMode = library.TimePickerMaskMode,
		ValueState = coreLibrary.ValueState;

	return Controller.extend("vodafone.RepintApprov.repintapproval.controller.GestioneCalcoloeregole", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestioneCalcoloeregole
		 */
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("GestioneCalcoloeregole").attachPatternMatched(this._onObjectMatched, this);

			this.byId("TP1").setMaskMode(TimePickerMaskMode.On);
			this.byId("TP2").setMaskMode(TimePickerMaskMode.On);

			var oData = {
				"SelectedLivello": "1",
				"LivelloCollection": [{
					"ValoreId": "1",
					"Value": "1"
				}, {
					"ValoreId": "2",
					"Value": "2"
				}, {
					"ValoreId": "6",
					"Value": "3"
				}, {
					"ValoreId": "Q",
					"Value": "4"
				}, {
					"ValoreId": "Q8",
					"Value": "5"
				}]
			};

			var oModel = new JSONModel(oData);
			this.getView().byId("idLivelloCollection").setModel(oModel, "livelloModel");

			var oData1 = {
				"SelectedTipo": "1",
				"TipoGiornoCollection": [{
					"TipoGioId": "1",
					"Value": "FERIALE LLUN-VEN1"
				}, {
					"TipoGioId": "2",
					"Value": "FERIALE LLUN-VEN2"
				}, {
					"TipoGioId": "3",
					"Value": "FERIALE LLUN-VEN3"
				}, {
					"TipoGioId": "4",
					"Value": "FERIALE LLUN-VEN4"
				}, {
					"TipoGioId": "5",
					"Value": "FERIALE LLUN-VEN5"
				}]
			};

			var oModelTipo = new JSONModel(oData1);
			this.getView().byId("idTipoCollection").setModel(oModelTipo, "TipooModel");

			// this.mainData  = {
			// 	"ImportIInterCollection": 
			// 		[
			// 			{
			// 				"TipoGiorno": "FERIALE LLUN-VEN1",
			// 				"OraInizio": "17:30",
			// 				"Orafine": "23:00",
			// 				"Valore":"20$",
			// 				"Livello": "6"
			// 			}
			// 		]
			// 	};

			// for the data binding example do not use the change event for check but the data binding parsing events
			Core.attachParseError(
				function (oEvent) {
					var oElement = oEvent.getParameter("element");

					if (oElement.setValueState) {
						oElement.setValueState(ValueState.Error);
					}
				});

			Core.attachValidationSuccess(
				function (oEvent) {
					var oElement = oEvent.getParameter("element");

					if (oElement.setValueState) {
						oElement.setValueState(ValueState.None);
					}
				});

		},

		onAddImpIntItem: function (oEvent) {

			if (this.getView().byId("idTableImpIntData").getModel("ImpIntDataModel") === undefined) {
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = this.getView().byId("idTableImpInv");

				this.mainData = {
					"ImportIInterCollection": [{
						"TipoGiorno": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
						"OraInizio": objTable.getItems()[0].getCells()[1].getValue(),
						"Orafine": objTable.getItems()[0].getCells()[2].getValue(),
						"Valore": objTable.getItems()[0].getCells()[3].getValue(),
						"Livello": objTable.getItems()[0].getCells()[4].getSelectedItem().getText(),
						"oEdit": true,
						"oDelete": true
					}]
				};

				this.oModelImpIntData = new JSONModel(this.mainData);
				this.getView().byId("idTableImpIntData").setModel(this.oModelImpIntData, "ImpIntDataModel");
			} else {
				var collection = this.getView().byId("idTableImpIntData").getModel("ImpIntDataModel").getProperty("/ImportIInterCollection");
				// Getting values entered by user from Table "idTableImpInv"
				var objTable = this.getView().byId("idTableImpInv");

				var item = {
					"TipoGiorno": objTable.getItems()[0].getCells()[0].getSelectedItem().getText(),
					"OraInizio": objTable.getItems()[0].getCells()[1].getValue(),
					"Orafine": objTable.getItems()[0].getCells()[2].getValue(),
					"Valore": objTable.getItems()[0].getCells()[3].getValue(),
					"Livello": objTable.getItems()[0].getCells()[4].getSelectedItem().getText(),
					"oEdit": true,
					"oDelete": true
				};

				collection.push(item);
				this.getView().byId("idTableImpIntData").getModel("ImpIntDataModel").setProperty("/ImportIInterCollection", collection);
			}

			// objTable.getItems()[0].getCells()[0].getSelectedItem().getText(); // FERIALE LLUN-VEN2"
			// objTable.getItems()[0].getCells()[1].getValue(); // "3:50:45 PM"
			// objTable.getItems()[0].getCells()[2].getValue(); // "7:00:00 PM
			// objTable.getItems()[0].getCells()[3].getValue(); // "10"
			// objTable.getItems()[0].getCells()[4].getSelectedItem().getText(); // "2"
		},

		onEdit: function (e) {
			var t = e.getSource().getParent();
			var a = this.getView().byId("idTableImpIntData");
			var o = a.indexOfItem(t);
			var i = a.getModel("ImpIntDataModel").getObject("/ImportIInterCollection")[o];
			if (i) {
				var n = a.getItems()[o];
				this.onPress(n, false);
				var r = a.getItems()[o];
				if (e.getSource().getPressed()) {
					this.onPress(r, true)
				} else {
					this.onPress(r, false)
				}
			}
		},

		onPress: function (e, t) {
			var a = e.getCells();
			for (var o = 0; o < a.length - 2; o++) {
				var i = a[o];
				var aa = i.getMetadata();
				var obj = aa.getElementName();
				if (obj == "sap.m.Input") {
					i.setEnabled(t);
					i.setEditable(t)
				}
			}
		},

		onDelete: function (e) {

			// var t = e.getSource().getParent();
			// var a = this.getView().byId("idTableImpIntData");
			// var o = a.indexOfItem(t);
			// this.mainData.ImportIInterCollection.splice(a, 1);
			// this.oModelImpIntData.refresh();

			var t = e.getSource().getBindingContext("ImpIntDataModel").getObject();
			for (var a = 0; a < this.mainData.ImportIInterCollection.length; a++) {
				if (this.mainData.ImportIInterCollection[a] == t) {
					this.mainData.ImportIInterCollection.splice(a, 1);
					this.oModelImpIntData.refresh();
					break
				}
			}

		},

		handleChange: function (oEvent) {
			var oTP = oEvent.getSource(),
				sValue = oEvent.getParameter("value"),
				bValid = oEvent.getParameter("valid");

			if (bValid) {
				oTP.setValueState(ValueState.None);
			} else {
				oTP.setValueState(ValueState.Error);
			}
		},

		// onEdit1: function (e) {
		// 	var t = e.getSource().getParent().getParent();
		// 	var i = this.getView().byId("idTableHistory1");
		// 	var a = i.indexOfItem(t);
		// 	//var s = i.getModel("MainModel1").getObject("/ItemsInfo1")[a];
		// 	var s = true;

		// 	if (s) {
		// 		var l = i.getItems()[a];
		// 		this.onPress1(l, false);
		// 		var h = i.getItems()[a];
		// 		if (e.getSource().getPressed()) {
		// 			this.onPress1(h, true)
		// 		} else {
		// 			this.onPress1(h, false)
		// 		}
		// 	}
		// },

		// onPress1: function (e, t) {
		// 	var i = e.getCells();
		// 	for (var a = 1; a < i.length - 1; a++) {
		// 		var s = i[a];
		// 		if (s.getItems()) {
		// 			var l = s.getItems();
		// 			$(l).each(function (e) {
		// 				var i = l[e].getMetadata();
		// 				var a = i.getElementName();
		// 				if (a == "sap.m.Text") {
		// 					l[e].setVisible(!t)
		// 				}
		// 				if (a == "sap.m.CheckBox") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.DatePicker") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.TimePicker") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.Select") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.Input") {
		// 					l[e].setVisible(t);
		// 					l[e].setEditable(t)
		// 				}
		// 				if (a == "sap.m.Label") {
		// 					l[e].setVisible(t)
		// 				}
		// 			})
		// 		}
		// 	}
		// },

		// onDelete1: function (e) {
		// 	var t = e.getSource().getParent().getParent();
		// 	var i = this.getView().byId("idTableHistory1");
		// 	var a = i.indexOfItem(t);
		// 	var s = i.getModel("MainModel1").getObject("/ItemsInfo1")[a];
		// 	for (var l = 0; l < this.mainData1.ItemsInfo1.length; l++) {
		// 		if (this.mainData1.ItemsInfo1[l] == s) {
		// 			this.mainData1.ItemsInfo1.splice(l, 1);
		// 			this.oMainModel1.refresh();
		// 			break
		// 		}
		// 	}
		// 	this.getView().byId("txtAggiorna1").setText(this.mainData1.ItemsInfo1.length);
		// 	var h = 0;
		// 	var r = 0;
		// 	var f = 0;
		// 	var o = 0;
		// 	var n = 0;
		// 	var b = 0;
		// 	for (var l = 0; l < this.mainData1.ItemsInfo1.length; l++) {
		// 		if (this.mainData1.ItemsInfo1[l].h1h == true) {
		// 			h = h + 1
		// 		}
		// 		if (this.mainData1.ItemsInfo1[l].h12h == true) {
		// 			r = r + 1
		// 		}
		// 		if (this.mainData1.ItemsInfo1[l].h24h == true) {
		// 			f = f + 1
		// 		}
		// 		if (this.mainData1.ItemsInfo1[l].h46h == true) {
		// 			o = o + 1
		// 		}
		// 		if (this.mainData1.ItemsInfo1[l].h68h == true) {
		// 			n = n + 1
		// 		}
		// 		if (this.mainData1.ItemsInfo1[l].h8h == true) {
		// 			b = b + 1
		// 		}
		// 	}
		// 	this.getView().byId("txt1h").setText(h);
		// 	this.getView().byId("txt12h").setText(r);
		// 	this.getView().byId("txt24h").setText(f);
		// 	this.getView().byId("txt46h").setText(o);
		// 	this.getView().byId("txt68h").setText(n);
		// 	this.getView().byId("txt8h").setText(b)
		// },			

		// onDeleteCategory2: function (e) {
		// 	var t = this.getView().getModel("MainModel1").getProperty("/ItemsInfo1");
		// 	var i = e.getSource().getParent().getParent().indexOfItem(e.getSource().getParent());
		// 	if (t.length - 1 === i) {
		// 		t[i - 1].bAdd = true
		// 	}
		// 	t.splice(i, 1);
		// 	if (t.length === 1) {
		// 		t[0].bDelete = false;
		// 		t[0].bAdd = true
		// 	}
		// 	this.getView().getModel("MainModel1").setProperty("/ItemsInfo1", t);
		// 	this.getView().byId("txtAggiorna1").setText(t.length);
		// 	this.getView().byId("txtElimina1").setText(t.length)
		// },

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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestioneCalcoloeregole
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestioneCalcoloeregole
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf vodafone.RepintApprov.repintapproval.view.GestioneCalcoloeregole
		 */
		//	onExit: function() {
		//
		//	}

	});

});