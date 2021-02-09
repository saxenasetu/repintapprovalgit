sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue : function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		formatBtnText: function(sValue) {
			if(sValue === "" || sValue === undefined || sValue === null){
				return "";
			}
			else{
				if(sValue === "Y"){
					return "Approve";	
				}
				else{
					return "Reject";	
				} 
			}
		},
		
		formatForwardBtnText: function(sValue) {
			if(sValue === "" || sValue === undefined || sValue === null){
				return false;
			}
			else{
				if(sValue === "Y"){
					return true;	
				}
				else{
					return false;	
				} 
			}
		}				
	};
});