function od(position){
/*
 * 
 * 
 */
if(typeof position !== "object"){
	var position = {
				my : "center top+40 ",
				at : "center top ",
				within : window
	};
}
var id = Math.random().toString(36).substring(7);

var dialog = jQuery('<div />').dialog({
	position : position,
	dialogClass: id,
//	show: { effect: "blind", duration: 9800 },
	buttons: [{
		showText: false,
		icons: {
			primary: "ui-icon-close"
		},
		click : function(){
			jQuery(this).dialog("destroy");
		}			
	}],
	open : function() {	
		var d = jQuery(this).dialog('widget');
		d.find(".ui-dialog-titlebar").remove();
		//open_popup_node(this, nid);		
	},
});

//jQuery(dialog).dialog( "option", "dialogClass", id );

jQuery(".color").die("click:open").on("click:destroy", {dialog:dialog}, function(e) {
	jQuery('#'+id).dialog("destroy");
	jQuery(this).die("click:destroy");
});

return [dialog, id];
}

