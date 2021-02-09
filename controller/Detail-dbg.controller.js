sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/library",
	"vodafone/RepintApprov/repintapproval/util/Services",
	"sap/m/MessageToast",
	"sap/ui/Device"

], function (BaseController, JSONModel, formatter, Filter, FilterOperator, mobileLibrary, Services, MessageToast, Device) {
	"use strict";

	// // shortcut for sap.m.URLHelper
	// var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("vodafone.RepintApprov.repintapproval.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			// var oViewModel = new JSONModel({
			// 	busy : false,
			// 	delay : 0
			// });

			var oViewModel = this._createViewModel();
            this.empId = null;
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		// onSendEmailPress: function () {
		// 	var oViewModel = this.getModel("detailView");

		// 	URLHelper.triggerEmail(
		// 		null,
		// 		oViewModel.getProperty("/shareSendEmailSubject"),
		// 		oViewModel.getProperty("/shareSendEmailMessage")
		// 	);
		// },

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {

			// Set Visibility of Reperibilita and Intervento Table, ToolBar and Title as false on every selected of Master record. 
			//		this.getView().byId("idInterventoTable").setVisible(false);
			//		this.getView().byId("idReperibilitaTable").setVisible(false);
			//		this.getView().byId("idInterventoToolBar").setVisible(false);
			//		this.getView().byId("idReperibilitaToolBar").setVisible(false);

			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");
			//	oViewModel.setProperty("/busy", true);

			////////// Dynamically create table 
			// this.getView().byId("detailPage").setContent(
			// 		new sap.m.Table({
			// 			backgroundDesign: sap.m.BackgroundDesign.Solid,
			// 			inset: true,
			// 			headerToolbar: new sap.m.Toolbar({
			// 				content: [new sap.m.Label({
			// 					text: "{i18n>TABLE HEADER}"
			// 				}), new sap.m.ToolbarSpacer({})]
			// 			}),
			// 			columns: [
			// 				new sap.m.Column({
			// 					header: new sap.m.Label({
			// 						text: "{i18n>Date}",
			// 						hAlign: sap.ui.core.TextAlign.Center
			// 					})
			// 				}),
			// 				new sap.m.Column({
			// 					header: new sap.m.Label({
			// 						text: "{i18n>Reperibilita}",
			// 						hAlign: sap.ui.core.TextAlign.Center
			// 					})
			// 				}),
			// 				new sap.m.Column({
			// 					header: new sap.m.Label({
			// 						text: "{i18n>Intervento}",
			// 						hAlign: sap.ui.core.TextAlign.Center
			// 					})
			// 				}),
			// 				new sap.m.Column({
			// 					header: new sap.m.Label({
			// 						text: "{i18n>LPN}",
			// 						hAlign: sap.ui.core.TextAlign.Center
			// 					})
			// 				}),
			// 				new sap.m.Column({
			// 					header: new sap.m.Label({
			// 						text: "{i18n>Approve}",
			// 						hAlign: sap.ui.core.TextAlign.Center
			// 					})
			// 				}),
			// 				new sap.m.Column({
			// 					header: new sap.m.Label({
			// 						text: "{i18n>Reject}",
			// 						hAlign: sap.ui.core.TextAlign.Center
			// 					})
			// 				}),
			// 				new sap.m.Column({
			// 					header: new sap.m.Label({
			// 						text: "{i18n>Forward}",
			// 						hAlign: sap.ui.core.TextAlign.Center
			// 					})
			// 				}),
			// 			]
			// }).addStyleClass("sapFSemanticPageAlignContent"));

			/// ************* UNCOMMENT -  Commented below code will be used while binding actual service **************
			// this.getModel().metadataLoaded().then( function() {
			// 	var sObjectPath = this.getModel().createKey("Repint", {
			// 		repintID :  sObjectId
			// 	});
			// 	this._bindView("/" + sObjectPath);
			// }.bind(this));

			// var aFilter = [];
			// if (sObjectId) {
			// 	aFilter.push(new Filter("repintID", FilterOperator.Contains, sObjectId));
			// }

			var oRepintDetail = [];
			var oRepintDetailJsonData = {};
			var oRepintEmpHeaderJsonData = {};
			var oRepintEmpHeaderJson = [];
			var repintReperibilitaModel = new sap.ui.model.json.JSONModel();
			var repintEmpHdrModel = new sap.ui.model.json.JSONModel();
			var oRepintReperibilitaJson = [];
			var oRepintReperibilitaJsonData = {};
			var oRepintDetatilJsonData = {};
			var repintDetailModel = new sap.ui.model.json.JSONModel();
			var that = this;

			var xsoBaseModel = this.getOwnerComponent().getModel("basexsoModel");

			/*	xsoBaseModel.attachRequestSent(function () {
					that._busyDialog.open();
				});
				xsoBaseModel.attachRequestCompleted(function () {
					that._busyDialog.close();
				});
				*/
			//	var urlgetDetails = "/HANAMDC/REPINT/RepintApproval/xsodata/RepintApproval.xsodata/RepintEmpHeader(IDSCHEDA=" + sObjectId + ")";
			var path = "/RepintEmpHeader(IDSCHEDA=" + sObjectId + ")"; // + that.getOwnerComponent().getModel("viewProperties").getProperty("/IDSCHEDA") + ")";

			var mParameters = {
				async: false,
				urlParameters: {
					"$expand": "REPERIBILITA,INTERVENTI"
				},
				success: function (oDataIn, oResponse) {
					console.log("******* EXPAND ******");
					console.log(oDataIn);

					// Getting Repint Employee Header data
					var rep = oDataIn.REPERIBILITA.results.length;
					if (rep == "1") {
						var rep2 = "X";
					}
					var inte = oDataIn.INTERVENTI.results.length;
					if (inte == "1") {
						var nte = "X";
					}
					if (oDataIn.STATO == "100") {
						var stato = "Da approvare";
					}
					var annomese = that.formatDate(oDataIn.ANNOMESE);
					oRepintEmpHeaderJsonData = {
						"IDSCHEDA": oDataIn.IDSCHEDA,
						"MATRICOLA": oDataIn.MATRICOLA,
						"COGNOME": oDataIn.COGNOME,
						"ANNOMESE": annomese,
						"Reperibilita": rep2,
						"Intervento": nte,
						"LPN": "",
						"STATO": stato,
						"NOME": oDataIn.NOME

					};

					//	oRepintEmpHeaderJson.push(oRepintEmpHeaderJsonData);
					//	oRepintEmpHeaderJsonData = {};

					repintEmpHdrModel.setData(oRepintEmpHeaderJsonData);

					that.getView().setModel(repintEmpHdrModel, "RepintEmpHdrModel");
					//	that.getView().setModel(new sap.ui.model.json.JSONModel(repintEmpHdrModel), "RepintEmpHdrModel");

					// Getting REPERIBILITY data	
					for (var i = 0; i < oDataIn.REPERIBILITA.results.length; i++) {
						if (oDataIn.REPERIBILITA.results[i].FLAGNOTTURNO == "1") {
							var lpn = "X";
						}
						var datarep = that.formatDate(oDataIn.REPERIBILITA.results[i].DATAREPERIBILITA);
						oRepintReperibilitaJsonData = {
							"DATAREPERIBILITA": datarep,
							"LPN": lpn,
							//	"DATAREPERIBILITA": oDataIn.REPERIBILITA.results[i].DATAREPERIBILITA,
							"IDREPERIBILITA": oDataIn.REPERIBILITA.results[i].IDREPERIBILITA,
							"no": "1",
							"IDSCHEDA": oDataIn.REPERIBILITA.results[i].IDSCHEDA

						};
						/*						oRepintReperibilitaJson.push(oRepintReperibilitaJsonData);
												oRepintReperibilitaJsonData = {};*/
					}

					repintReperibilitaModel.setData(oRepintReperibilitaJsonData);
					that.getView().byId("idReperibilitaTable").setModel(repintReperibilitaModel, "RepintReperibilitaModel");
					//	that.getView().setModel(new sap.ui.model.json.JSONModel(repintReperibilitaModel), "RepintReperibilitaModel");

					var repintInterventiModel = new sap.ui.model.json.JSONModel();
					var oRepintInterventiJson = [];
					var oRepintInterventiJsonData = {};

					// Getting Interventi data
					for (var j = 0; j < oDataIn.INTERVENTI.results.length; j++) {

						oRepintInterventiJsonData = {
							"DATAINTERVENTO": oDataIn.INTERVENTI.results[j].DATAINTERVENTO,
							"ORAINIZIO": oDataIn.INTERVENTI.results[j].ORAINIZIO,
							"ORAFINE": oDataIn.INTERVENTI.results[j].ORAFINE,
							"CHIAMATODA": oDataIn.INTERVENTI.results[j].CHIAMATODA,
							"RIP": "Y",
							"CAUSA": oDataIn.INTERVENTI.results[j].CAUSA
						};
						// oRepintReperibilitaJson.push(oRepintReperibilitaJsonData);
						// oRepintReperibilitaJsonData = {};
					}

					repintInterventiModel.setData(oRepintInterventiJsonData);
					that.getView().byId("idInterventoTable").setModel(repintInterventiModel, "RepintInterventiModel");

					// that.getView().byId("txtAggiorna1").setText(repintInterventiModel.getData().length);
					// that.getView().byId("txtElimina1").setText(repintInterventiModel.getData().length);

				},
				error: function (oError) {
					jQuery.sap.log.getLogger().error("Repint data fetch failed" + oError.toString());
				}

			};
			xsoBaseModel.read(path, mParameters);
			// var oJsonDtlData = {
			// 	"results": [{
			// 			"repintID": "1000",
			// 			"date": "01/04/20",
			// 			"Reperibilita": "X",
			// 			"Intervento": "",
			// 			"LPN": "",
			// 			"Approve": "Y",
			// 			"Reject": "Y",
			// 			"Forward": "Y",
			// 			"repint": "Gianni Guttuso",
			// 			"Scheda": "marzo2020",
			// 			"Status": "To be approved"
			// 		}, {
			// 			"repintID": "1000",
			// 			"date": "02/04/20",
			// 			"Reperibilita": "",
			// 			"Intervento": "X",
			// 			"LPN": "",
			// 			"Approve": "Y",
			// 			"Reject": "Y",
			// 			"Forward": "Y",
			// 			"repint": "Gianni Guttuso",
			// 			"Scheda": "marzo2020",
			// 			"Status": "To be approved"
			// 		}, {
			// 			"repintID": "1000",
			// 			"date": "03/04/20",
			// 			"Reperibilita": "X",
			// 			"Intervento": "X",
			// 			"LPN": "",
			// 			"Approve": "Y",
			// 			"Reject": "Y",
			// 			"Forward": "Y",
			// 			"repint": "Gianni Guttuso",
			// 			"Scheda": "marzo2020",
			// 			"Status": "To be approved"
			// 		}, {
			// 			"repintID": "1000",
			// 			"date": "04/04/20",
			// 			"Reperibilita": "",
			// 			"Intervento": "",
			// 			"LPN": "X",
			// 			"Approve": "Y",
			// 			"Reject": "Y",
			// 			"Forward": "Y",
			// 			"repint": "Gianni Guttuso",
			// 			"Scheda": "marzo2020",
			// 			"Status": "To be approved"
			// 		}, {
			// 			"repintID": "2000",
			// 			"date": "02/05/20",
			// 			"Reperibilita": "",
			// 			"Intervento": "X",
			// 			"LPN": "",
			// 			"Approve": "N",
			// 			"Reject": "N",
			// 			"Forward": "Y",
			// 			"repint": "Valerio Ferrari",
			// 			"Scheda": "swiss2022",
			// 			"Status": "Approved"
			// 		}, {
			// 			"repintID": "2000",
			// 			"date": "05/05/20",
			// 			"Reperibilita": "X",
			// 			"Intervento": "X",
			// 			"LPN": "",
			// 			"Approve": "N",
			// 			"Reject": "Y",
			// 			"Forward": "N",
			// 			"repint": "Valerio Ferrari",
			// 			"Scheda": "swiss2022",
			// 			"Status": "Approved"
			// 		}, {
			// 			"repintID": "2000",
			// 			"date": "06/05/20",
			// 			"Reperibilita": "",
			// 			"Intervento": "",
			// 			"LPN": "X",
			// 			"Approve": "Y",
			// 			"Reject": "N",
			// 			"Forward": "N",
			// 			"repint": "Valerio Ferrari",
			// 			"Scheda": "marzo2020",
			// 			"Status": "Approved"
			// 		}, {
			// 			"repintID": "3000",
			// 			"date": "06/06/20",
			// 			"Reperibilita": "",
			// 			"Intervento": "",
			// 			"LPN": "X",
			// 			"Approve": "Y",
			// 			"Reject": "Y",
			// 			"Forward": "Y",
			// 			"repint": "Kapil Sharma",
			// 			"Scheda": "marzo2022",
			// 			"Status": "Pending"
			// 		}, {
			// 			"repintID": "4000",
			// 			"date": "06/07/20",
			// 			"Reperibilita": "X",
			// 			"Intervento": "X",
			// 			"LPN": "X",
			// 			"Approve": "Y",
			// 			"Reject": "Y",
			// 			"Forward": "Y",
			// 			"repint": "Francesca Signoroni",
			// 			"Scheda": "marzo2022",
			// 			"Status": "Pending"
			// 		}, {
			// 			"repintID": "4000",
			// 			"date": "10/07/20",
			// 			"Reperibilita": "",
			// 			"Intervento": "X",
			// 			"LPN": "X",
			// 			"Approve": "Y",
			// 			"Reject": "Y",
			// 			"Forward": "N",
			// 			"repint": "Francesca Signoroni",
			// 			"Scheda": "marzo2022",
			// 			"Status": "Pending"
			// 		}

			// 	]

			// };

			/*			var oJsonDtlDataModel = new sap.ui.model.json.JSONModel(oJsonDtlData);
						this.setModel(oJsonDtlDataModel, "DtlDataModel");

						/////var oDataModel = this.getOwnerComponent().getModel("DtlDataModel");

						var newoDataModel = this.getModel("DtlDataModel").getData().results.filter(function (event, index) {
							if (event.repintID === sObjectId) {
								return event;
							}
						});

						// Formatting to enable/diable Approve, Reject and Forward buttons
						for (var i = 0; i < newoDataModel.length; ++i) {
							if (newoDataModel[i].Approve === "Y") {
								newoDataModel[i].Approve = true;
							} else {
								newoDataModel[i].Approve = false;
							}

							if (newoDataModel[i].Reject === "Y") {
								newoDataModel[i].Reject = true;
							} else {
								newoDataModel[i].Reject = false;
							}

							if (newoDataModel[i].Forward === "Y") {
								newoDataModel[i].Forward = true;
							} else {
								newoDataModel[i].Forward = false;
							}

						}

						var newoJaonDataModel = new sap.ui.model.json.JSONModel(newoDataModel);
						this.getView().byId("idRepintAppDtlTable").setModel(newoJaonDataModel);
						//this.getView().byId("idProductsTable").getModel().refresh();

						//var oDtlAppDataModel = this.getOwnerComponent().getModel("appProperties");
						var dtlData;
						if (newoJaonDataModel.getData().length > 0) {
							dtlData = {
								"repint": newoJaonDataModel.getData()[0].repint,
								"repintID": newoJaonDataModel.getData()[0].repintID,
								"status": newoJaonDataModel.getData()[0].Status
							};

							this.getView().setModel(new sap.ui.model.json.JSONModel(dtlData), "hdrDataModel");
						} else {
							dtlData = {
								"repint": "Jay Singh",
								"repintID": "5000",
								"status": "Rejected"
							};

							this.getView().setModel(new sap.ui.model.json.JSONModel(dtlData), "hdrDataModel");
						}

						// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
						oViewModel.setProperty("/busy", false);*/

			////this.getView().byId("list").setModel(oDataModel);			
			////this._bindView("/" + sObjectId.results);
			///this._bindView(oDataModel);	

		},

		formatDate: function (sValue) {
			if (sValue === "" || sValue === undefined || sValue === null) {
				return "";
			} else {
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd-MM-yyyy"
				});
				//sValue = sValue.substring(0,sValue.indexOf("T")); // E.g Returns "2018-04-03" from "2018-04-03T00:00:00" 
				return oDateFormat.format(new Date(sValue), true);
			}
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		//_bindView : function (sObjectPath) {
		_bindView: function (oDataModel) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			//	oViewModel.setProperty("/busy", false);

			/// ************* UNCOMMENT -  Commented below code will be used while binding actual service **************
			// this.getView().bindElement({
			// 	path : sObjectPath,
			// 	//model : oDataModel,
			// 	events: {
			// 		change : this._onBindingChange.bind(this),
			// 		dataRequested : function () {
			// 			oViewModel.setProperty("/busy", true);
			// 		},
			// 		dataReceived: function () {
			// 			oViewModel.setProperty("/busy", false);
			// 		}
			// 	}
			// });

		},

		_createViewModel: function () {
			return new JSONModel({
				busy: false,
				delay: 0,
				title: "",
				noDataText: this.getResourceBundle().getText("notFoundTitle")
			});
		},

		// Take care of the navigation through the hierarchy when the
		// user selects a table row
		onSelectTableRow: function (oEvent) {

			// // Set Visibility of Reperibilita and Intervento Table, ToolBar and Title as false on every selected of Master record. 
			// this.getView().byId("idInterventoTable").setVisible(false);
			// this.getView().byId("idReperibilitaTable").setVisible(false);
			// this.getView().byId("idInterventoToolBar").setVisible(false);
			// this.getView().byId("idReperibilitaToolBar").setVisible(false);	

			this.getView().byId("idReperibilitaTitle").setVisible(true);

			this._busyDialog = new sap.m.BusyDialog({
				showCancelButton: false
			});

			var oJsonDtlnterventoData = {
				"results": [{
						"no": "1",
						"Lpn": "Y",
						"Data": "03-01-2020",
						"OraInizio": "19:30",
						"OraFine": "21:00",
						"Chiamatodo": "NOC",
						"Rip": "",
						"Causa": "WO0000004924724",
						"1h": "",
						"1h2h": "Y",
						"2h4h": "",
						"4h6h": "",
						"6h8h": "",
						"8h": ""
					}, {
						"no": "2",
						"Lpn": "N",
						"Data": "03-01-2020",
						"OraInizio": "23:35",
						"OraFine": "01:00",
						"Chiamatodo": "NOC",
						"Rip": "Y",
						"Causa": "WO0000004924776",
						"1h": "",
						"1h2h": "Y",
						"2h4h": "",
						"4h6h": "",
						"6h8h": "",
						"8h": ""
					}

				]
			};

			var oJsonDtlnterventoDataModel = new sap.ui.model.json.JSONModel(oJsonDtlnterventoData);

			oJsonDtlnterventoDataModel.attachRequestSent(function () {
				this._busyDialog.open();
			});
			oJsonDtlnterventoDataModel.attachRequestCompleted(function () {
				this._busyDialog.close();
			});

			// // Store original busy indicator delay for the detail view
			// var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay();

			// // Set busy indicator during view binding
			// var oViewModel = this.getModel("detailView");			

			// // Make sure busy indicator is displayed immediately when
			// // detail view is displayed for the first time
			// oViewModel.setProperty("/delay", 100);

			// // Binding the view will set it to not busy - so the view is always busy if it is not bound
			// oViewModel.setProperty("/busy", true);
			// // Restore original busy indicator delay for the detail view
			// oViewModel.setProperty("/delay", iOriginalViewBusyDelay);

			//oEvent.getSource().getSelectedItem().getBindingContext().getObject().Reperibilita === "X";

			if (oEvent.getSource().getSelectedItem().getBindingContext().getObject().Intervento === "X") {
				this.getView().byId("idInterventoTable").setVisible(true);
				this.getView().byId("idInterventoToolBar").setVisible(true);
				this.getView().byId("idInterventoTitle").setVisible(true);
				this.getView().byId("idInterventoTable").setModel(oJsonDtlnterventoDataModel);

			} else if (oEvent.getSource().getSelectedItem().getBindingContext().getObject().Intervento === "") {
				this.getView().byId("idInterventoTable").setVisible(false);
				this.getView().byId("idInterventoToolBar").setVisible(false);
				this.getView().byId("idInterventoTitle").setVisible(false);
			}

			if (oEvent.getSource().getSelectedItem().getBindingContext().getObject().Reperibilita === "X") {
				this.getView().byId("idReperibilitaTable").setVisible(true);
				this.getView().byId("idReperibilitaToolBar").setVisible(true);
				this.getView().byId("idReperibilitaTitle").setVisible(true);
				this.getView().byId("idReperibilitaTable").setModel(oJsonDtlnterventoDataModel);

			} else if (oEvent.getSource().getSelectedItem().getBindingContext().getObject().Reperibilita === "") {
				this.getView().byId("idReperibilitaTable").setVisible(false);
				this.getView().byId("idReperibilitaToolBar").setVisible(false);
				this.getView().byId("idReperibilitaTitle").setVisible(false);
			}

			//oViewModel.setProperty("/busy", false);
			//oEvent.oSource.oParent.mAggregations.cells[19].mProperties.text;
		},

		onPressApprove: function (oEvent) {
			var oController = this;
			var ApproveModel = this.getView().getModel("RepintEmpHdrModel");
			var empID = this.getOwnerComponent().getModel("empModel").getData().name;
			var Header = {};

			Header = {
				"IDSCHEDA": ApproveModel.oData.IDSCHEDA,
				"TIMESTAMP": ApproveModel.oData.ANNOMESE,
				"STATO": "101",
				"ID": empID
			};
			var sPayload = {
				"Object": {
					"Header": Header
				}
			};

			this.sServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;
			var url = "/HANAMDC/REPINT/RepintApproval/xsjs/approve.xsjs/?IDEMP=" + empID + "&idscheda=" + ApproveModel.oData.IDSCHEDA +
				"&status=101&approvedate=2020-06-08T00:00:00";
			$.ajax({
				url: this.sServiceUrl + "/",
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
				},
				success: function (data, textStatus, XMLHttpRequest) {
					var token = XMLHttpRequest.getResponseHeader("X-CSRF-Token");
					$.ajax({
						url: url,
						type: "POST",
						contentType: "application/json",
						data: JSON.stringify(sPayload),
						//dataType: 'jsonp',
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
						},
						success: function (data1, textStatus1, XMLHttpRequest1) {
							console.log("*********** SUCCESS ******************");

							console.log(data1);
							console.log(textStatus1);

							that.refreshAPP();

							/*							that.getView().byId("idApprovazione1").setValue(sap.ui.core.format.DateFormat.getDateTimeInstance({
															pattern: "yyyy-MM-dd HH:MM"
														}).format(new Date(), true));*/

						},
						error: function (data1, textStatus1, XMLHttpRequest1) {
							console.log("Error in DeepInsert");
							MessageBox.error(
								"Error while perfoming Salva operation"
							);
							jQuery.sap.log.getLogger().error("RepintCambioResponsabile data fetch failed" + textStatus1.toString());
							console.log(textStatus1);

						}
					});
				}
			});

		},

		refreshAPP: function (oEvent) {
			var oList = sap.ui.getCore().byId("master--list");
			var oItem = oList.getSelectedItem();
			var oContext = oItem.getBindingContext();
			var oListItemData = oContext.getObject();

			var oPath = oContext.getPath();
			//Get the Index
			var idx = parseInt(oPath.slice(-1));
			var oModel = oList.getModel().getData();
			if (idx !== -1) {
				var m = oList.getModel();
				var data = m.getData();
				var removed = data.splice(idx, 1);
				m.setData(data);
			} else {
				alert("Please select a row");
			}
			oList.getModel().setProperty("/", oModel);
			oList.removeSelections();
			var oDetail = sap.ui.getCore().byId("detail");
			var oHeader = this.getView().byId("oHeader");
			oDetail.setBindingContext(null);
			oHeader.setBindingContext(null);
		},

		onPressReject: function (oEvent) {
			var oController = this;
			var RejectModel = this.getView().getModel("RepintEmpHdrModel");
			var empID = this.getOwnerComponent().getModel("empModel").getData().name;
			var Header = {};

			Header = {
				"IDSCHEDA": RejectModel.oData.IDSCHEDA,
				"TIMESTAMP": RejectModel.oData.ANNOMESE,
				"STATO": "201",
				"ID": empID
			};
			var sPayload = {
				"Object": {
					"Header": Header
				}
			};

			this.sServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;
			var url = "/HANAMDC/REPINT/RepintApproval/xsjs/reject.xsjs";
			$.ajax({
				url: this.sServiceUrl + "/",
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch"); //Passing CSRF token fetch request in header of GET 
				},
				success: function (data, textStatus, XMLHttpRequest) {
					var token = XMLHttpRequest.getResponseHeader("X-CSRF-Token");
					$.ajax({
						url: url,
						type: "POST",
						contentType: "application/json",
						data: JSON.stringify(sPayload),
						//dataType: 'jsonp',
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", token); //Passing actual CSRF token we got from previous GET request
						},
						success: function (data1, textStatus1, XMLHttpRequest1) {
							console.log("*********** SUCCESS ******************");

							console.log(data1);
							console.log(textStatus1);

							that.refreshAPP();

							/*							that.getView().byId("idApprovazione1").setValue(sap.ui.core.format.DateFormat.getDateTimeInstance({
															pattern: "yyyy-MM-dd HH:MM"
														}).format(new Date(), true));*/

						},
						error: function (data1, textStatus1, XMLHttpRequest1) {
							console.log("Error in DeepInsert");
							MessageBox.error(
								"Error while perfoming Salva operation"
							);
							jQuery.sap.log.getLogger().error("RepintCambioResponsabile data fetch failed" + textStatus1.toString());
							console.log(textStatus1);

						}
					});
				}
			});
		},

		// getSplitContObj: function () {
		// 	var result = this.byId("detailPage");
		// 	return result;
		// },

		onPressGestisciDelegati: function (oItem) {
			var bReplace = !Device.system.phone;

			//this.getRouter().navTo("GestisciDelegati",bReplace);
			this.getRouter().navTo("GestisciDelegati");
			//this.getView().byId("detailPage").to(this.createId("GestisciDelegati"));
		},

		onPressGestioneCalcoloeregole: function (oItem) {
			var bReplace = !Device.system.phone;

			//this.getRouter().navTo("GestisciDelegati",bReplace);
			this.getRouter().navTo("GestioneCalcoloeregole");
			//this.getView().byId("detailPage").to(this.createId("GestisciDelegati"));
		},

		// Search Dialog to select Employee Id while performing 'Forward' operation
		handleEmpSearchDialog: function (oEvent) {
			var oController = this;

			oController.inputId = oEvent.getSource().getId();
			oController.selectedUserItem = undefined;
			// create value help dialog
			if (!oController._valueHelpUserDialog) {
				oController._valueHelpUserDialog = sap.ui.xmlfragment(
					"vodafone.RepintApprov.repintapproval.view.EmpSearchDialog",
					oController
				);
				oController.getView().addDependent(oController._valueHelpUserDialog);
			}

			// open value help dialog
			oController._valueHelpUserDialog.open();

		},

		onSearchEmpSearch: function (oEvent) {
			var sValueUserFirstName;
			var sValueUserLastName;
			var sValueEmpId;

			var searchTable = oEvent.getSource().getParent().getParent().getParent().getContent()[1];
			if (oEvent.getSource().getParent().getItems()[0].getValue() === "") {
				sValueUserFirstName = undefined;
			} else {
				sValueUserFirstName = oEvent.getSource().getParent().getItems()[0].getValue();
			}

			if (oEvent.getSource().getParent().getItems()[1].getValue() === "") {
				sValueUserLastName = undefined;
			} else {
				sValueUserLastName = oEvent.getSource().getParent().getItems()[1].getValue();
			}

			if (oEvent.getSource().getParent().getItems()[2].getValue() === "") {
				sValueEmpId = undefined;
			} else {
				sValueEmpId = oEvent.getSource().getParent().getItems()[2].getValue();
			}

			////////oController.fetchValueHelpUsers(sValueUserFirstName, sValueUserLastName, sValueEmpId, 1, searchTable);

			var oJsonEmpoData = {
				"results": [{
					"FirstName": "Valerio",
					"LastName": "Ferrari",
					"EmpId": "1111"
				}, {
					"FirstName": "Kapil",
					"LastName": "Sharma",
					"EmpId": "2222"
				}, {
					"FirstName": "Francesca",
					"LastName": "Signoroni",
					"EmpId": "3333"
				}, {
					"FirstName": "Jay",
					"LastName": "Singh",
					"EmpId": "4444"
				}, {
					"FirstName": "Gianni",
					"LastName": "Guttuso",
					"EmpId": "5555"
				}, {
					"FirstName": "Gianni",
					"LastName": "Guttuso1",
					"EmpId": "6666"
				}, {
					"FirstName": "Kapil",
					"LastName": "Sharma1",
					"EmpId": "7777"
				}, {
					"FirstName": "Valerio",
					"LastName": "Ferrari1",
					"EmpId": "8888"
				}, {
					"FirstName": "Francesca",
					"LastName": "Signoroni1",
					"EmpId": "9999"
				}, {
					"FirstName": "Jay",
					"LastName": "Singh1",
					"EmpId": "1010"
				}]
			};

			var oJsonEmpDataModel = new sap.ui.model.json.JSONModel(oJsonEmpoData);
			this.getView().setModel(oJsonEmpDataModel, "EmpDataModel");

			/////var oDataModel = this.getOwnerComponent().getModel("DtlDataModel");

			var newEmpData = this.getView().getModel("EmpDataModel").getData().results.filter(function (event, index) {
				///// if (event.EmpId === sValueEmpId || event.FirstName === sValueUserFirstName ||  event.LastName === sValueUserLastName) {
				if (event.EmpId.includes(sValueEmpId) || event.FirstName.includes(sValueUserFirstName) || event.LastName.includes(
						sValueUserLastName)) {
					return event;
				}
			});

			var newoDataEmpDataModel = new sap.ui.model.json.JSONModel(newEmpData);

			////sap.ui.getCore().byId("idEmpSearchTable").setModel(newoDataEmpDataModel);
			searchTable.setModel(newoDataEmpDataModel);

			var oTemplateUserDetail = new sap.m.ColumnListItem({
				type: "Active",
				cells: [
					new sap.m.Text({
						text: "{FirstName}"
					}),
					new sap.m.Text({
						text: "{LastName}"
					}),
					new sap.m.Text({
						text: "{EmpId}"
					})
				]
			});
			searchTable.bindAggregation("items", "/", oTemplateUserDetail);

		},

		// fetchValueHelpUsers: function(sValueUserFirstName, sValueUserLastName, sValueUserId, sRecordSet, oSearchTable) {
		// 	var oController = this;
		// 	var URLForFilter = "&$filter=";
		// 	var sQueryForValueHelp = "";
		// 	if (sValueUserFirstName.length > 0) {
		// 		URLForFilter = URLForFilter + "startswith(tolower(firstName),'" + sValueUserFirstName + "')";
		// 	}
		// 	if (sValueUserLastName.length > 0) {
		// 		if (URLForFilter !== "&$filter=") {
		// 			URLForFilter = URLForFilter + " and ";
		// 		}
		// 		URLForFilter = URLForFilter + "startswith(tolower(lastName),'" + sValueUserLastName + "')";
		// 	}
		// 	if (sValueUserId.length > 0) {
		// 		if (URLForFilter !== "&$filter=") {
		// 			URLForFilter = URLForFilter + " and ";
		// 		}
		// 		URLForFilter = URLForFilter + "startswith(tolower(userId),'" + sValueUserId + "')";
		// 	}
		// 	if (URLForFilter !== "&$filter=") {
		// 		sQueryForValueHelp = URLForFilter;
		// 	}
		// 	// Read Employee Details - Below code when consuming actual service
		// 	oController.Services.readEmployeesData(sQueryForValueHelp)
		// 		.then(function(localUserDetailsModel) { 
		// 			var UserDetailsModel = new sap.ui.model.json.JSONModel();
		// 			UserDetailsModel.setData({
		// 				Users: localUserDetailsModel.getData()
		// 			});
		// 			oSearchTable.setModel(UserDetailsModel);
		// 			var oTemplateUserDetail = new sap.m.ColumnListItem({
		// 				type: "Active",
		// 				cells: [
		// 					new sap.m.Text({
		// 						text: "{FirstName}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{LastName}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{EmpId}"
		// 					})
		// 				]
		// 			});
		// 			oSearchTable.bindAggregation("items", "/Users", oTemplateUserDetail);
		// 		});

		// },		

		onResetEmpSearch: function (oEvent) {
			var oController = this;
			var searchTable = oEvent.getSource().getParent().getParent().getParent().getContent()[1];
			var sValueUserFirstName = oEvent.getSource().getParent().getItems()[0];
			var sValueUserLastName = oEvent.getSource().getParent().getItems()[1];
			var sValueUserId = oEvent.getSource().getParent().getItems()[2];
			var UserDetailsModel = new sap.ui.model.json.JSONModel();
			UserDetailsModel.setData({});
			searchTable.setModel(UserDetailsModel);
			sValueUserFirstName.setValue("");
			sValueUserLastName.setValue("");
			sValueUserId.setValue("");
			oController.selectedUserItem = undefined;
		},

		onUserSelectionValueHelpUserPress: function (oEvent) {
			var oController = this;
			oController.selectedUserItem = oEvent.getSource().getSelectedItem();
		},

		onOkValueHelpUserDialog: function () {
			var oController = this;
			if (!oController.selectedUserItem) {
				MessageToast.show(oController.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgSelectUser"));
				return;
			}
			var localUserFullName = oController.selectedUserItem.getCells()[0].getText() + " " + oController.selectedUserItem.getCells()[1].getText();
			var localUserID = oController.selectedUserItem.getCells()[2].getText();
			//sap.ui.getCore().byId(oController.inputId).setValue(localUserFullName);
			//sap.ui.getCore().byId(oController.inputId).setDescription(localUserID);

			var msg = oController.getOwnerComponent().getModel("i18n").getResourceBundle().getText("forwardConfirmation", [localUserFullName]);
			MessageToast.show(msg);
			oController._valueHelpUserDialog.close();
		},

		onCloseValueHelpUserDialog: function () {
			var oController = this;
			oController._valueHelpUserDialog.close();
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.EmployeeID,
				sObjectName = oObject.Address,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
			}
		}

	});

});