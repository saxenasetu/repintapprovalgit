sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/m/MessageToast"],function(e,t,n){"use strict";return e.extend("vodafone.RepintApprov.repintapproval.controller.GestisciDelegati",{onInit:function(){this.getOwnerComponent().getRouter().getRoute("GestisciDelegati").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){},handleBack:function(e){var n=t.getInstance().getPreviousHash();if(n!==undefined){history.go(-1)}else{this.getOwnerComponent().getRouter().navTo("object")}},onPressSave:function(e){var t=this;n.show(t.getOwnerComponent().getModel("i18n").getResourceBundle().getText("save"))}})});