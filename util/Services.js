jQuery.sap.require("sap.m.MessageBox");jQuery.sap.declare("vodafone.RepintApprov.repintapproval.util.Services");vodafone.RepintApprov.repintapproval.util.Services=function(){this.readEmployeesData=function(e){var s=6e6;var t=new $.Deferred;var r="/successFactor-dest/User?$format=json&$select=firstName,lastName,userId,username"+e;var a=encodeURI(r);jQuery.ajax({timeout:s,url:a,type:"GET",cache:false,contentType:"application/json; charset=utf-8",headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"},success:function(e){t.resolve(new sap.ui.model.json.JSONModel(e.d.results))},async:true,error:function(e,s,r){var a=e.responseText?e.responseText:r;sap.m.MessageBox.alert(a,{icon:sap.m.MessageBox.Icon.ERROR,title:"Alert",onClose:null,styleClass:"",initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit});t.reject(e)}});return t.promise()}};