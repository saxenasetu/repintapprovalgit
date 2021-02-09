jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.declare("vodafone.RepintApprov.repintapproval.util.Services");
vodafone.RepintApprov.repintapproval.util.Services = function() {
	
	/// Service Calls
	this.readEmployeesData = function(queryForValueHelp) {
		var timeOut = 6000000;
		var deferred = new $.Deferred();
		var URI = "/successFactor-dest/User?$format=json&$select=firstName,lastName,userId,username" + queryForValueHelp;
		var finalUrl = encodeURI(URI);

		jQuery.ajax({
			timeout: timeOut,
			url: finalUrl,
			type: "GET",
			cache: false,
			contentType: "application/json; charset=utf-8",
			headers: {
				"Accept": "application/json",
				"X-Requested-With": "XMLHttpRequest"
			},
			success: function(data) {
				deferred.resolve(new sap.ui.model.json.JSONModel(data.d.results));
			},
			async: true,
			error: function(oEvent, sStatus, sError) {
				var errorMsg = oEvent.responseText ? oEvent.responseText : sError;
				sap.m.MessageBox.alert(errorMsg, {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Alert",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
				deferred.reject(oEvent);
			}
		});
		return deferred.promise();
	};	
	
};