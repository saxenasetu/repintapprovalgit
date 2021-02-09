$.sap.declare("RepintApprov.repintapproval.util.formatter");
RepintApprov.repintapproval.util.formatter = {

	setConvertValue : function(text) {
		if(text == true){
			return "X"
		}
		if(text == false){
			return ""
		}
	},

	checkTipogiornoFer : function(text) {
		if(text === "L"){
			return true;
		}else{
			return false;
		}
	},

	checkTipogiornoSab : function(text) {
		if(text === "S"){
			return true;
		}else{
			return false;
		}
	},	

	checkTipogiornoDom : function(text) {
		if(text === "F"){
			return true;
		}else{
			return false;
		}
	},

	formatDate: function(sValue) {
			if(sValue==="" || sValue===undefined || sValue===null){
				return "";
			}
			else{
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd-MM-yyyy"
				});
				//sValue = sValue.substring(0,sValue.indexOf("T")); // E.g Returns "2018-04-03" from "2018-04-03T00:00:00" 
				return oDateFormat.format(new Date(sValue), true);				
			}	
	},

	formatLPN: function(sValue) {
		if(sValue === 1){
			return true;
		}else{
			return false;
		}
		
	}
	
};