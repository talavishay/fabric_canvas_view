jQuery(document).ready(function(){
	//fff();
	if(Drupal.settings.canvas_view){
		//misc
		//jQuery("#page-title").css({"position":"absolute","top":"-70px"});
		jQuery("#page-title,#breadcrumb").remove();
		//jQuery.event.props.push('dataTransfer');
		jQuery("#ui-accordion-1-header-0").click();
		//misc ## END
		
		Drupal.settings.canvas_view.dom_parent = jQuery("#content .tabs").last();
		init(Drupal.settings.canvas_view.dom_parent );
	}
});
// init 
function init_fabric(){
	/**
	 * Item name is non-unique
	 */
	fabric.Canvas.prototype.getItemsByName = function(name) {
	  var objectList = [],
		  objects = this.getObjects();

	  for (var i = 0, len = this.size(); i < len; i++) {
		if (objects[i].name && objects[i].name === name) {
		  objectList.push(objects[i]);
		}
	  }

	  return objectList;
	};
	/**
	 * Item name is unique
	 */
	fabric.Canvas.prototype.getItemByName = function(name) {
	  var object = null,
		  objects = this.getObjects();

	  for (var i = 0, len = this.size(); i < len; i++) {
		if (objects[i].name && objects[i].name === name) {
		  object = objects[i];
		  break;
		}
	  }
	  if(object === null){
		  return false;
		} else {
			return object;
		}
	};
	fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
	fabric.Object.prototype.borderColor = 'red';
	fabric.Object.prototype.cornerColor = 'green';
	fabric.Object.prototype.cornerSize = 20;
	fabric.Canvas.prototype.backgroundColor = 'rgba(0,0,0,0.1)';
}
function init(parent) {
	init_fabric();
	draw_stage(parent);
	
	var json = Drupal.settings.canvas_view.json = jQuery(".field-name-field-layout-data .field-item").text();      
	
	if(json !== ""){
			json = JSON.parse(Drupal.settings.canvas_view.json);
			//var object = JSON.parse(json); //use default json parser
			Drupal.settings.canvas_view.canvas.loadFromJSON(json, function(){
				
				canvas_render();
			}, function(o, object){
			o.clipTo.replace(/width/i, o.width);
			});
			//window.setTimeout(function(){
				//canvas_render();
			//}, 10);
			//canvas_render();
	}
}
function draw_stage(dom_parent){
	dom_parent.after(jQuery('<canvas dir="rtl"  height="450" id="canvas_id"/>'));
	 canvas = Drupal.settings.canvas_view.canvas = new fabric.Canvas('canvas_id');
	//canvas.setHeight(500);	 
	canvas.selection = false;
	var scale = .6;
	canvas.setWidth(595 * scale);
	canvas.setHeight(842 * scale);
	bind_events(canvas);
	add_tools(canvas);
	window.setTimeout(function(){
		add_rect();
		pattern();
	},0);
	
	//canvas.on('mouse:over', function(e) {
		//console.log(e.target);
////		canvas_render();
	//});

}
function add_tools(canvas){
	var wrap =  jQuery('<div/>'),
		shapes =  jQuery('<div id="shapes"/>'),
		text =  jQuery('<div/>'), 
		general = jQuery('<div id="general"/>'), 
		svg = jQuery('<div id="svg"/>');
		borders = jQuery('<div id="borders"/>');
		overlay = jQuery('<div id="overlay"/>');
		bacckground  = jQuery('<div id="background"/>');
	
	
	//jQuery("body").append(colorpicker);
	
	general.addClass("tools")
		.append(selectSLider("opacity", get_select("opacity", 1, 100)))
		.append(selectSLider("scale", get_select("scale", 1, 100)))
		.append(jQuery('<div/>').css("display", "block")
			.append(jQuery('<input type="file" multiple id="input" >'))
			.append(jQuery('<input type="checkbox"  >'))
			.append(jQuery('<button id="uploadBtn">uploadBtn</button>').addClass("ui-icon-trash"))
		)		
		.append(jQuery('<button id="clear">clear</button>').addClass("ui-icon-trash"))
		.append(jQuery('<button id="delete">X</button>').addClass("ui-icon-trash"))
		.append(jQuery('<button id="elmUp">up</button>'))
		.append(jQuery('<button id="elmDown">down</button>'))
		.append(jQuery('<button id="clip">clip</button>'))
//		.append(jQuery('<button id="reload">reload</button>'))
		.append(jQuery('<button class="draw">draw</button>'))
		.append(jQuery('<button data-toggle="off" class="color"><span class="color">color</span></button>')) //farbtastic
		.append(jQuery('<button data-toggle="off" class="color_grad"><span class="color_gradeint_preview">GRAD</span></button>'))
		.append(jQuery('<button  id="save">save</button>'));

	text
		//.append(jQuery('<button class="color"><span class="color"></span></button>'))
		.append(selectSLider("font size", get_select("fontsize", 8, 60)) )
		.append(selectSLider("line height", get_select("lineheight", 8, 30)))
		.append(jQuery('<button class="draw">draw</button>'))
		.append(jQuery('<button id="bold">bold</button>'))
		.append(jQuery('<button id="underline">underline</button>'))
		.append(jQuery('<button id="alignLeft">left</button>'))
		.append(jQuery('<button id="alignCenter">center</button>'))
		.append(jQuery('<button id="alignRight">right</button>'))
		.append(jQuery('<textarea id="addText" value="add some text"/>'))
		.append(jQuery('<select/>'));
	
	shapes
		.append(jQuery('<button id="circle">circle</button>'))
		//.append(jQuery('<button id="triangle">triangle</button>'))
		.append(jQuery('<button id="rect">rect</button>'));
	
	svg
		.append(jQuery('<input type="number" step="0.1"  class="yscale" value="1.2"/>'))
		//.append(jQuery('<input type="number" step="0.1" class="xscale" value="1.2"/>'))
		.append(jQuery('<br/>'))
	
			
	jQuery.each(Drupal.settings.canvas_view.svg_items.animals, function(i,val){
		var img = jQuery('<img style="width:30px;" src="/sites/all/modules/fabric_canvas_view/svg/animals/'+val+'" />');
		svg.append(img.clone());
		overlay.append(img.clone());
		shapes.append(img.clone());
	});
	
	jQuery.each(Drupal.settings.canvas_view.svg_items.borders, function(i,val){
		borders.append(jQuery('<img style="width:30px;" src="/sites/all/modules/fabric_canvas_view/svg/borders/'+val+'" />'));
		
	
	});
	borders
		.append(jQuery('<input type="number" step="0.1"  class="yscale" value="1.2"/>'))
		//.append(jQuery('<input type="number" step="0.1" class="xscale" value="1.2"/>'));
		
	bacckground
		.append(jQuery('<input type="file" >'))
		.append(jQuery('<input type="number">'))
		.append(jQuery('<input type="checkbox"  >'))
		.append(jQuery('<button id="uploadBtn">uploadBtn</button>'))
		.append(jQuery('<button id="rotate">rotate</button>'))
		.append(jQuery('<button id="scaleY">scaleY</button>'))
		.append(jQuery('<button id="scaleX">scaleX</button>'))
		.append(jQuery('<button data-toggle="off" class="color_grad"><span class="color_gradeint_preview">GRAD</span></button>'));

		
	var wrap_g = jQuery('<div/>')
	.append(general);
	//.append(colorpicker_wrap.hide())
				//.hide()
	
	//var color_gradeint_tool = _color_gradeint_tool();
	//color_gradeint_tool.dialog();
	
	//setup jqueryui accordion structure
	wrap
		//.append('<h3>general</h3>')
		//.append(wrap_g)
		.append('<h3>bacckground</h3>')
		.append(bacckground)
		.append('<h3>text</h3>')
		.append(text)
		.append('<h3>shapes</h3>')
		.append(shapes)
		.append('<h3>overlay</h3>')
		.append(overlay)
		.append('<h3>svg mask/clip</h3>')
		.append(svg)
		.append('<h3>borders</h3>')
		.append(borders);
	
	//bind_tools(general);
	jQuery("button", wrap_g).button({text:false});
	
	jQuery( wrap).accordion({
		collapsible: true,
		header: "h3",
		heightStyle: "content"
	});
	jQuery("#sidebar-first").prepend(wrap);
	//Drupal.settings.canvas_view.dom_parent.after(wrap_g);
	//jQuery(wrap_g).dialog({position:{my:"right top",at:"right top"}}s/);
	jQuery(wrap_g).dialog({
		closeOnEscape: false,
		title: "tools",
		resizable: false ,
		position : { 	my : "right top",
						at : "right top+30",
						of	:	window
		},
		create: function( event, ui ) {
			jQuery("button", this).button({text:false});
		}
	});//.dialog('widget').find(".ui-dialog-titlebar").hide();;
	
	//jQuery(wrap_g).dialog({
		 //closeOnEscape: false,
		//title: "general",
		 //resizable: false ,
		 //create: function (event) {
			//jQuery(event.target).parent().css('position', 'fixed'); 
		//},
		//resizeStart: function (event) {
			//jQuery(event.target).parent().css('position', 'fixed'); 
		//},
		//resizeStop: function (event) {
			//jQuery(event.target).parent().css('position', 'fixed'); 
		//},
		//position : {my : "left top+20",at:"left top+20"},
		//open: function( event, ui ) {
			//jQuery("button", this).button({text:false});
		//}
		//}).dialog('widget').find(".ui-dialog-titlebar").hide();
	//jQuery(".region-sidebar-first").prepend(wrap);
	
	//jQuery( "button.close" ).button({
		//icons: {
		//primary: "ui-icon-locked"
		//},
		//text: false
	//});
	
	bind_tools(wrap);
	bind_tools(wrap_g);
//jQuery("#color_gradeint_tool").hide();
}
function _file_queue(new_files){
	//var canvas = Drupal.settings.canvas_view.canvas;
	//var canvas_images = canvas.getObjects('image');
	
	var current_queue = jQuery.map(fff, function(val, i){
		return val.name;
	});	
	//var current_canvas_images = jQuery.map(canvas_images, function(val, i){
		//return val.name;
	//});	
	
	var tmp = jQuery.map(new_files, function(file,i){
		if (jQuery.inArray(file.name, current_queue) >= 0) { 
			handle_duplicate_files(file);
			return null; 
		}
		//if (jQuery.inArray(file.name, current_canvas_images) >= 0) { 
			//handle_duplicate_files(file);
			//return null; 
		//}
		return file;
	});
	//merge new files to files list 
	jQuery.merge(fff, tmp);
	console.log(fff);
}
function bind_tools(context) {
	fff = Array();
	jQuery('#uploadBtn', 	context).on("click", 	function click_upload_btn(){
		send(fff);
	});
	
	jQuery('#background [type=file]', 		context).on("change", 	function input_chagne(e){
		//if(jQuery("[type=checkbox]:checked").length !== 0){
			_file_queue(e.target.files);
			var file = e.target.files[0];
			add_canvas_background_image(file,"background");
		//}
	});
	jQuery('#background #rotate', 		context).on("click", 	function input_chagne(e){
		canvas.backgroundImage.angle += 90 ;
		canvas_render();
	});
	jQuery('#background #scaleX', 		context).on("click", 	function input_chagne(e){
		canvas.backgroundImage.scaleToWidth(canvas.width);
		canvas_render();
	});
	jQuery('#background #scaleY', 		context).on("click", 	function input_chagne(e){
		canvas.backgroundImage.scaleToHeight(canvas.height);
		canvas_render();
	});
	jQuery('#input', 		context).on("change", 	function input_chagne(e){

		var canvas = Drupal.settings.canvas_view.canvas;
		var active = canvas.getActiveObject(); 				
		_file_queue(e.target.files);

		if( active !== null){
			set_active_background(file, active);
		} else {
			add_image(file,null);
		}

    }); 

	jQuery("#addText", 		context).on('changed keyup', function addtextevent(e){
		var canvas = Drupal.settings.canvas_view.canvas;
		var active = canvas.getActiveObject();
		if(active === undefined){
			if(e.keyCode == 13){
				add_text(canvas, this.value);
			} 
		} else {
			active.setText(this.value);
			canvas_render();
		}
		
	});
	jQuery(".color", 		context).on('click', 	function click_colorpicker(e){
		var target = jQuery(e.target),
			state = target.data('toggle');
		if (state === 'off') {
			target.data('dialog_id', _colorpicker());
			target.data('toggle', "on");
		}
		if (state === 'on') {
			var id = target.data('dialog_id');
			jQuery('#'+id).dialog("destroy");
			target.data('toggle', "off");
		}
		//jQuery("#colorpicker_wrap").toggle();
	});
	jQuery("#clear", 		context).on('click', 	function click_clear(e){
		Drupal.settings.canvas_view.canvas.clear();
	});
	jQuery("#rect", 		context).on('click', 	function click_add_rect(e){
		add_rect();
	});
	jQuery("#triangle", 	context).on('click', 	function click_add_triangle(e){
		add_triangle();
	});
	jQuery("#circle", 		context).on('click', 	function click_add_circle(e){
		add_circle();
	});
	jQuery("#setColor", 	context).on('change', 	function setColor(e){
		canvas.getActiveObject().fill = jQuery(e.currentTarget).val() ;
		canvas_render();
	});
	jQuery("#delete", 		context).on('click', 	function click_delete(e){
		Drupal.settings.canvas_view.canvas.getActiveObject().remove();
		canvas_render();
	});
	jQuery("#elmDown", 		context).on('click', 	function sendBackwards(e){
		Drupal.settings.canvas_view.canvas.getActiveObject().sendBackwards();
		canvas_render();
	});
	jQuery("#elmUp", 		context).on('click', 	function bringForward(e){
		//Drupal.settings.canvas_view.canvas.getActiveObject().bringForward();
		Drupal.settings.canvas_view.canvas.getActiveObject().bringToFront();
		canvas_render();
	});
	jQuery("#clip", 		context).on('click', 	function click_clip(e){
		//Drupal.settings.canvas_view.canvas.getActiveObject().bringForward();
		clip();
	});
	jQuery(".draw", 		context).on('click', 	function click_draw(e){
		add_content(Drupal.settings.canvas_view.canvas);
	});
	jQuery("#underline", 	context).on('click', 	function click_draw(e){
		var canvas = Drupal.settings.canvas_view.canvas;
		var active = canvas.getActiveObject();
		//TODO: if text ?!
		var underline = active.getTextDecoration();
		
		if(underline === "underline"){
			active.textDecoration = false;
		} else {
			active.textDecoration = 'underline';
		}
		canvas_render();
		
	});
	jQuery("#bold", 		context).on('click', 	function click_bold(e){
		var canvas = Drupal.settings.canvas_view.canvas;
		var active = canvas.getActiveObject();
		var bold = active.getFontWeight();
		
		if(bold === "bold"){
			active.fontWeight = 'normal';
		} else {
			active.fontWeight = 'bold';
		}
		canvas_render();
	});
	jQuery("#alignRight", 	context).on('click', 	function click_balignRight(e){
		var canvas = Drupal.settings.canvas_view.canvas;
		var active = canvas.getActiveObject();
		active.setTextAlign('right');
		canvas_render();
	});
	jQuery("#alignCenter", 	context).on('click', 	function click_alignCenter(e){
		var canvas = Drupal.settings.canvas_view.canvas;
		var active = canvas.getActiveObject();
		active.setTextAlign('center');
		canvas_render();
	});
	jQuery("#alignLeft", 	context).on('click', 	function click_alignLeft(e){
		var canvas = Drupal.settings.canvas_view.canvas;
		var active = canvas.getActiveObject();
		active.setTextAlign('left');
		canvas_render();
	});
	jQuery("#svg img", 		context).on('click', 	function click_save_svg(e){
		var src = jQuery(e.currentTarget).attr("src");
		var xscale = jQuery("#svg #xscale").val();
		var yscale = jQuery("#svg #yscale").val();
		
		clip_svg(src,xscale,yscale);
	});
	jQuery("#overlay img", 	context).on('click', 	function click_overlay(e){
		var src = jQuery(e.currentTarget).attr("src");
		var xscale = jQuery(".xscale").val();
		var yscale = jQuery(".yscale").val();
	
		overlay_svg(src, xscale, yscale);
	});
	jQuery("#shapes img", 	context).on('click', 	function click_add_shape(e){
		var src = jQuery(e.currentTarget).attr("src");
		var xscale = jQuery(".xscale").val();
		var yscale = jQuery(".yscale").val();
	
		add_svg(src, xscale, yscale);
	});
	jQuery("#borders img", 	context).on('click', 	function click_add_border(e){
		var src = jQuery(e.currentTarget).attr("src");
		//var xscale = jQuery("#svg #xscale").val();
		//var yscale = jQuery("#svg #yscale").val();
		var xscale = jQuery("#svg .xscale").val();
		var yscale = jQuery("#svg .yscale").val();
		
		overlay_svg(src, xscale, yscale);
	});
	jQuery("#general .color_grad", 	context).on('click',	function click_color_grad(e){
		var target = jQuery(e.target);
		var state = target.data('toggle');
		if (state === 'off') {
			var id = _color_gradeint_tool();
			target.data('dialog_id', id);
			target.data('toggle', "on");
		}
		if (state === 'on') {
			var id = target.data('dialog_id');
			jQuery('#'+id).dialog("destroy");
			target.data('toggle', "off");
		}
	});
	jQuery("#background .color_grad", 	context).on('click',	function click_color_grad(e){
		var target = jQuery(e.target);
		var state = target.data('toggle');
		if (state === 'off') {
			var id = _color_gradeint_tool(true);
			if(canvas.getItemByName("background_grad")){
				add_canvas_background_grad(id);
			}
			target.data('dialog_id', id);
			target.data('toggle', "on");
		}
		if (state === 'on') {
			var id = target.data('dialog_id');
			jQuery('#'+id).dialog("destroy");
			target.data('toggle', "off");
		}
	});
	jQuery("#save", 		context).on('click', 	function click_save(e){
		var canvas = Drupal.settings.canvas_view.canvas;
		jQuery.ajax({
			url : "/save_canvas_handler",
			type : "POST",
			data : {
				"nid"			:	9,
				"layout_data"	: 	JSON.stringify(canvas.toDatalessJSON())
			},
			success : function(d){
				jQuery(e.currentTarget).css("background-color","green");
				window.setTimeout(function(){
					jQuery(e.currentTarget).css("background-color","");
				},2000);
				console.log(d);
			}
		});
	});
}
function bind_events(canvas){
	//dragenter  dragleave dragenter
	jQuery(".canvas-container").on('drop', handleDrop_event);
	jQuery("img").on('dragstart', handleDragstart_event);
	jQuery(".canvas-container").bind("dragover", function(e) {
		e.originalEvent.dataTransfer.dropEffect = 'move';
		  
	    e.preventDefault();
	    return false;
	});
}

/*	FIX: text placement bug ?!?!
 * call the renderAll() Fn twice to fix a wired "glitch"
 * in the text placement within the object frame..
 * reproduce:
 * set font size
 * the set bold
 * the switch bold off.
 * 
 * result:
 * when the text comes back from bold state the orignal unbolded text 
 * is at a differnt position the the "new" unbolded text... 
 */
function canvas_render(){
	
	
	//if(typeof Drupal.settings.canvas_view.canvas.state === "undefined"){
		//Drupal.settings.canvas_view.canvas.state = false;
	//}
	
	//if(Drupal.settings.canvas_view.canvas.state === false){
		Drupal.settings.canvas_view.canvas.interval = window.setTimeout(function(){
			var canvas = Drupal.settings.canvas_view.canvas;
			//Drupal.settings.canvas_view.canvas.state = true;
			//canvas.setCoords();
			canvas.calcOffset();
			canvas.renderAll();
console.log('tick.');
			
		},500);
		Drupal.settings.canvas_view.canvas.interval = window.setTimeout(function(){
			var canvas = Drupal.settings.canvas_view.canvas;
			//Drupal.settings.canvas_view.canvas.state = true;
			//canvas.setCoords();
			canvas.calcOffset();
			canvas.renderAll();
console.log('tick.');

		},500);
		//window.setTimeout(function(){

			//Drupal.settings.canvas_view.canvas.state  = false;
			//console.log('up ...');
			//window.clearInterval(Drupal.settings.canvas_view.canvas.interval);
			//delete interval;

		//},2000);
	//}
}


function add_rect(options){
	var canvas = Drupal.settings.canvas_view.canvas;
	_options = {
		left: (canvas.width - canvas.width / 3)*Math.random(),
		top: (canvas.height - canvas.height / 3)*Math.random(),
		fill: getRandomColor(),
		width: canvas.width / 3,
		height: canvas.height / 3,
	};
	var options = (typeof options === "undefined") ? _options : options;
	var rect = new fabric.Rect(options);
	canvas.add(rect);
	canvas.setActiveObject(rect);
	return rect;
}

function add_circle(){
		var canvas = Drupal.settings.canvas_view.canvas;
		var circle = new fabric.Circle({
			radius: canvas.width / 6,
			fill: getRandomColor(),
			left: (canvas.width - canvas.width / 3)*Math.random(),
			top: (canvas.height - canvas.height / 3)*Math.random()
});
		canvas.add(circle);
}
function add_content(canvas){
	//jQuery(Drupal.settings.canvas_view.image_items).each(function(i,val){
		//add_image(val.src);
	//});	
	add_text(canvas);
	//draw_rect(canvas);
	//set_background_img(canvas);
}
function add_text(canvas, data ){
	var data = typeof data === "undefined" ? 'hello world': data;
	
	var text = new fabric.IText(data, { 
		textAlign: "right",
		left: 100, 
		top: 100 
	});
	text.on('changed', function(e) {
		jQuery("#addText").val(this.text);
		console.log('changed', this.text);
	});
	
	text.on('selected', function(e) {
		jQuery("#addText").val(this.text);		
		console.log('selected', this.text);
	});
	
	var canvas = Drupal.settings.canvas_view.canvas;
	canvas.add(text);
	
	//var l = canvas._objects.length,
		//current = l -1;
	
	canvas.setActiveObject(text);
	//canvas.setActiveObject(canvas._objects[current]);
	
	text.on('', function(e) {
		console.log('changed', text, e);
	});
	canvas.add(text);
	
}



function add_canvas_background_grad(){
	_options = {
		//right	:	0,
		//left	:	0,
		fill	:	getRandomColor(),
		width	:	canvas.width ,
		height	:	canvas.height ,
		originX : "left",
		originY : "top",
		hasControls : false,
		selectable: false,
		name : "background_grad"
		
	};
	var rect_bg = add_rect(_options);
	rect_bg.sendToBack();
}
function add_canvas_background_image(file){
	var canvas = Drupal.settings.canvas_view.canvas;

	var reader = new FileReader();
	reader.onloadend = function(file_ready) { 
		var image = new Image();
		image.onload = function(i) {
			EXIF.getData(i.target, function() {
				var orienation = EXIF.getTag(this, "Orientation");
				console.log(orienation);
			});			
		};
		
		image.src = file_ready.target.result;
		//var bin = atob(file_ready.target.result.split(',')[1]);
		//var exif = EXIF.readFromBinaryFile(new BinaryFile(bin));
		var ex = EXIF.getAllTags(file_ready.target.result);
		console.log(ex);
			//width: canvas.width, 
			//height: canvas.height,
		var options = {
			originX : 'center', 
			originY : 'center',
			left : canvas.width/2,
			top : canvas.height/2,
		};
		if(jQuery("#background [type=checkbox]:checked").length === 1){
			options.angle 	= "90";
			options.originX = 'center';
			options.originY = 'center';
			options.width = canvas.height;
			options.height = canvas.width;
			options.left = canvas.width/2;
			options.top = canvas.height/2;
			
		} 
		canvas.setBackgroundImage(file_ready.target.result, canvas.renderAll.bind(canvas), options);
		canvas_render();
	};
	reader.readAsDataURL(file);
}
function set_active_background(file, active){
	var canvas = Drupal.settings.canvas_view.canvas;
	var reader = new FileReader();
	reader.onloadend = function(file_ready) { 
		fabric.Image.fromURL(file_ready.target.result, function(oImg){
			//oImg.set({
				//scale: active.width / oImg.width, 
				//height: active.height / oImg.height,
				//originX: 'left', 
				//originY: 'top'
			//});
			active.setPatternFill({
				source : oImg,
				repeat: 'repeat'
				//source : _image_to_canvas_to_objectFill(oImg, active.width, active.height)
			});
			canvas_render();
		});
	};
	reader.readAsDataURL(file);

}
function add_image(file,target){
	var canvas = Drupal.settings.canvas_view.canvas;
	var imageType = /image.*/;
	var name = file.name
	
	if (file.type){
		if (!file.type.match(imageType)) {
		  return;
		}
	
	var img = document.createElement("img");
	img.file = file;
	
	var reader = new FileReader();
	//reader.onload = function(e){
	//console.log("e");
	//console.log(e);
	//}
	reader.onloadend = function(file) { 
		var image = new Image();

		image.onload = function() {
			var data = {};
			data.width = image.width;
			data.height = image.height;
			
			fabric.Image.fromURL(image.src, function(oImg){
			if(canvas.getActiveObject() !== null){
				//var canvas = Drupal.settings.canvas_view.canvas;
				//var active = canvas.getActiveObject();
				//oImg.set({
					//originX: "left",
					//originY: "top",
					//angle: 30,
					//opacity: 0.85,
					//left: canvas.width /2,
					//top: canvas.height/2,
					//scaleY: (canvas.height / data.height)*0.8,
					//scaleX: (canvas.width / data.width)*0.8,
					//name: name,
					//xyz : name
				//});
				canvas.add(oImg);
				render_canvas();
			} else {
				oImg.set({
									//originX: "left",
						//originY: "top",
						//angle: 30,
						//opacity: 0.85,
						left: canvas.width /2,
						top: canvas.height/2,
						scaleY: (canvas.height / data.height)*0.8,
						scaleX: (canvas.width / data.width)*0.8,
						name: name,
						xyz : name	
				});	
				canvas.setBackgroundImage(oImg, canvas.renderAll.bind(canvas));				//pattern(image,target);
			}
			}); 
		image.src = this.result;
		};
	}
	reader.readAsDataURL(file);

	} else {
	   //var rand = ""+Math.random();  
	   //var canvas = jQuery('<canvas id="rand_id_'+rand.replace(/\./, "")+'"/>') ;   
	   //var ctx = canvas[0].getContext("2d"); 
	   var img = dragelm[0];
	   //ctx.drawImage(img, 10, 10); 
	   //file = canvas[0].toDataURL("image/png");
	   //var data = {};
			//data.width = image.width;
			//data.height = image.height;
			fabric.Image.fromURL(file[0].src, function(oImg) {				
				canvas.add(oImg);
			},{
			//originX: "left",
			//originY: "top",
			//angle: 30,
			//opacity: 0.85,
			left: canvas.width /2,
			top: canvas.height/2,
			//scaleY: canvas.height / data.height,
			//scaleX: canvas.width / data.width,
			//name: name,
			//xyz : name
			});
	
	}
	
	
}
function handleDrop_event(e){
		console.log(e);
		e.preventDefault();
	    e.stopPropagation();
	    var data = e.originalEvent.dataTransfer.getData ('data');
        var type = e.originalEvent.dataTransfer.getData ('type');
        if(type == "IMG"){
        	add_image(dragelm);
        }
        
       // set_background_img(null, data);
        console.log(type);
}
function handleDragstart_event(e) {
	e.originalEvent.dataTransfer.setData('data', jQuery(this).attr("src"));
	e.originalEvent.dataTransfer.setData('type', this.tagName);
	dragelm = jQuery(this);
	console.log(this.tagName);
	e.data = "x";
	
}
function clip(){
	var canvas = Drupal.settings.canvas_view.canvas;
	var active = canvas.getActiveObject();
	if(typeof active.getClipTo() === "function"){
		active.set({ clipTo: null});
	} else {
		var width = active.width;
		active.set({ clipTo: function(ctx) {
			ctx.arc(0, 0, this.width/4, 0, Math.PI*2, true);
		}});
	}
	canvas_render();
}

function pattern(url , target){
	var url = (typeof url === "undefined") ? null : url;
	var canvas = Drupal.settings.canvas_view.canvas;
	var active = canvas.getActiveObject();

	//var padding = 0;

	if(url === null){
		var url = 'http://lifebook/files/1/IMG_1228.JPG';
	}
	
    fabric.Image.fromURL(url, function(img) {
		if( active ){ 
			var width = active.width;
			var height = active.height;
			
			img.set({
				width: width, 
				height: height, 
				originX: 'left', 
				originY: 'top'
			});
						
			active.set({
				fill: _image_to_canvas_to_objectFill(img, width, height)
			});
		} 
		if(target === "background"){
			var p = _image_to_canvas_to_objectFill(img.src, width, height);
			canvas.setBackgroundColor(p);				 ;
		}
		
		canvas_render();
	});
}
function _image_to_canvas_to_objectFill(img, width, height){
	    
	    var _canvas = new fabric.StaticCanvas();
		_canvas.setBackgroundImage(img, _canvas.renderAll.bind(_canvas));
	    
	    //var pat = ;
		return _pattern(_canvas,width, height);
}
function _pattern(canvas, width, height){
	return new fabric.Pattern({
		source: function() {
			canvas.setDimensions({
				width: width,
				height: height
			});
			return canvas.getElement();
		},
		repeat: 'no-repeat',
		//offsetX : active.width/2,
		//offsetY : active.height/2,
		//offsetX : 50,
		//offsetY : 50,
	});
}

// SVG
function  add_svg(src, xscale, yscale){
	fabric.loadSVGFromURL(src, function(objects, options) {	
		var canvas = Drupal.settings.canvas_view.canvas;
		var loadedObject;
		if (objects.length >= 1) {
			loadedObject = new fabric.PathGroup(objects, options);
		} else {
			loadedObject = objects[0];
		}
		
		canvas.add(loadedObject);
		canvas.setActiveObject(loadedObject);
		//loadedObject.centerH();
		//loadedObject.centerV();
		
		canvas_render();
	});
	
}
function  overlay_svg(src, xscale, yscale){
	var canvas = Drupal.settings.canvas_view.canvas;
	var active = canvas.getActiveObject();
		
	fabric.loadSVGFromURL(src, function(objects, options) {	
		var loadedObject;
		if (objects.length >= 1) {
			loadedObject = new fabric.PathGroup(objects, options);
		} else {
			loadedObject = objects[0];
		}

		var group1 = new fabric.Group([active,loadedObject],{
			left: active.left,
			top	: active.top,
			width: active.currentWidth,
			height: active.currentHeight,
			angle: active.angle,

			//originY : "top",
					
		});
group1.on('selected', function(e) {
  console.log(e);
  Drupal.settings.canvas_view.currentGroup = this;
});
		loadedObject.set({
			
			left : 0,
			top: 0,
			//width: active.currentWidth,
			//height: active.currentHeight,
			scaleY: (active.currentHeight / loadedObject.height) * yscale,
			scaleX: (active.currentWidth / loadedObject.width) * yscale,
        });
        
        console.log("scaleX" + (active.height / loadedObject.height));
        
        loadedObject.setCoords();
		active.set({
			left : 0,
			top:0,
						angle: 0,
						padding : 50
			//originX : "left",
			//originY : "top",
		});
        active.setCoords();

		canvas.add(group1);
		active.remove();
		canvas_render();
	})
}
function clip_svg(src,yscale,xscale){
	var canvas = Drupal.settings.canvas_view.canvas;
	var active = canvas.getActiveObject();
	//if(active.clipTo === null){
	fabric.loadSVGFromURL(src, function(objects, options) {
		var loadedObject;
		if (objects.length > 1) {
			loadedObject = new fabric.PathGroup(objects, options);
		} else {
			loadedObject = objects[0];
		}
		
		loadedObject.set({
			left: 0,
			top	: 0,
			scaleY: (active.height / loadedObject.height) ,//* yscale,
			scaleX: (active.width / loadedObject.width) //* xscale,
        });
	
		active.set({ 
			clipTo: function(ctx) {
				loadedObject.render(ctx);
			}
		});
	    canvas.calcOffset();
		canvas_render();	
	});
}

//add_tools helpers
function get_select(name, min, max) {
	var select= jQuery('<select name="'+name+'" id="'+name+'"/>');
	for(var i=min; i<=max; i++){
		select.append('<option value="'+ i + '">' + i + '</option>');
	}
	return select;
}
function selectSLider(label,select){
	var name = select.attr("name"),
		option = jQuery("option", select);
	var min = option.first().val(),
		max = option.last().val(),
		step = option.first().next().val() - min;
	var wrap = jQuery('<div class="selectSLider "/>')
	.append(jQuery('<label for="'+name+'">'+label+'</label>'))
	.append(select.addClass("ui-helper-reset"))
	.append(jQuery( '<div id="slider_'+name+'" />' )
		.slider({
			min	: parseInt(min),
			max	: parseInt(max),
			step: step,
			value: min,
			stop: function( event, ui ) {
				jQuery(select).data("val", ui.value).change().data("val", false).val(ui.value);
			},
		})
	);		
	jQuery( select ).on("change keyup", function(e) {
		var	val = jQuery(this).data("val");
		if ( val ){
			jQuery("#slider_"+name).slider( "value",val );			
		} else {
			val =  jQuery(this).val();
			jQuery("#slider_"+name).slider( "value",val );			
		}
		sliderAction(name,val);
	});
	
	return wrap;
}
function sliderAction(name,val,active){
	var canvas = Drupal.settings.canvas_view.canvas;
	var active = canvas.getActiveObject();
	
	if(typeof active === "object"){		
		if(name == "fontsize" ){
			active.fontSize = val;
		}
		if(name == "opacity" ){
			active.opacity = val/100;
		}
		if(name == "lineheight" ){
			active.setLineHeight(val/10);
		}
		if(name == "scale" ){
			active.setScaleY(val/10);
			active.setScaleX(val/10);
		}
		canvas_render();
	}
}

//add on tools 
function handleFiles(files) {
	//jQuery('#input').fileupload({
		//url: '/file_upload_handler',
	////dataType: 'json',
        //done: function (e, data) {
            //jQuery.each(data.result, function (index, file) {
                //jQuery('<p/>').text(file.name).appendTo(document.body);
            //});
        //},
        //add:function (e, data) {
			
           //jQuery("#uploadBtn").off('click').on('click',function () {           
             //data.submit();
           //});
        //}	
	//})
	////.fileupload('add', {
		//files: files,
		//url: '/file_upload_handler'
	//});
	//for (var i = 0; i < files.length; i++) {
		//var file = files[i];
		//var imageType = /image.*/;
		
		//if (!file.type.match(imageType)) {
		  //continue;
		//}
		
		////var img = document.createElement("img");
		////img.classList.add("obj");
		////img.file = file;
		
		//var reader = new FileReader();
		//reader.onload = function(theFile) { 
			//var image = new Image(), data = {};
			//image.src = theFile.target.result;

			//image.onload = function() {
				//data.width = image.width;
				//data.height = image.height;
				//add_image(theFile.target.result, data);
			//};
		//};
		
		//reader.readAsDataURL(file);
	//}
}

function handle_duplicate_files(dup){
	console.log("duplicate file "+dup.name+" removed from file list");
}
function send(files){
	jQuery('<input type="file"/>').fileupload().fileupload('add', {
		files: files, 
	    singleFileUploads: false,   // << send all together, not single
		url: '/file_upload_handler',
		success: function(d,x){
				d = JSON.parse(d);
				jQuery(d.files).each(function(i, val){
					console.log(val) 
					var item = Drupal.settings.canvas_view.canvas.getItemByName(val.name);
					item.setAttribute("src", val.url);
					canvas_render();
					
			});		
		}
	});
}
function _colorpicker(){
	var id = "colorpicker_wrap";
	var colorpicker_wrap = jQuery('<div id="'+id+'"></div>')
		.append('<button class="close">close</button>');
	
	jQuery(".close", colorpicker_wrap).on("click", function(){
		colorpicker_wrap.dialog("destroy");
		jQuery(".color").data("toggle","off");
	});
	
	var d = colorpicker_wrap.dialog({
			resizable: false,
			height: "auto",
			width: "370",
			open: 	function( event, ui ) {
					colorpicker = jQuery('<div id="colorpicker"></div>').ColorPicker({
						flat: true,
						onHide: function (colpkr) {	return false;},
						onChange:  function (hsb, hex, rgb) {	
							colorpicker_handler(hex);
							return false;	},
						onSubmit:  function (colpkr) {	return false;	}
					});
					jQuery(this).append(colorpicker);
			}
	}).dialog("widget");
	jQuery(".ui-dialog-titlebar", d).remove();

	return id;
	//return colorpicker_wrap.append(colorpicker);
}
function _color_gradeint_tool(background){		
	var id = "color_gradeint_tool";
	var background = typeof background === "undefined" ? false : background;
	//var grad_dir = jQuery('<select id="grad_dir"/>');
	//jQuery([{name:"topToBottom", icon : "ui-icon-arrowthick-2-n-s"}, 
			//{name:"leftToRight", icon : "ui-icon-script"},
			//{name:"topLeftToBottomRight", icon : "ui-icon-script"}, 
			//{name:"topRightToBottomLeft", icon : "ui-icon-script"}
			//]).each(function(i,val){
		//grad_dir.append('<option  value="'+val.name+'">'+val.name+'</option>');
	//});
	var grad_dir = jQuery('<div id="grad_dir"/>');
	jQuery([{name:"topToBottom", icon : "ui-icon-arrowthick-2-n-s", toggle:"on"}, 
			{name:"leftToRight", icon : "ui-icon-arrowthick-2-e-w", toggle:"off"},
			{name:"topLeftToBottomRight", icon : "ui-icon-arrowthick-2-se-nw", toggle:"off"}, 
			{name:"topRightToBottomLeft", icon : "ui-icon-arrowthick-2-ne-sw", toggle:"off"}
			]).each(function(i,val){
		grad_dir.append('<button data-toggle="'+val.toggle+'" data-icon="'+val.icon+'" data-value="'+val.name+'">'+val.name+'</button>');
	});
	var color_gradeint_tool = jQuery('<div id="'+id+'"></div>')
			.append('<button class="close">close</button>')
			.append(grad_dir);
	jQuery(".close", color_gradeint_tool).on("click", function(){
		color_gradeint_tool.dialog("destroy");
		jQuery(".color_grad").data("toggle","off");
	});
	
	
							
	//jQuery('#grad_dir-button', color_gradeint_tool).click(function(){
		//jQuery('.undefined-menu', color_gradeint_tool).toggle();
	//});
	var d = color_gradeint_tool.dialog({
			resizable: false,
			height: 200,
			open: function( event, ui ) {
				window.setTimeout(function(color_gradeint_tool){
					jQuery("#color_gradeint_tool", color_gradeint_tool).gradientPicker({
					   change: function(p,s){
							console.log(background);
							handle_gradient(p,s,background);
							return false;
						},
					   fillDirection: "bottom",
					   controlPoints: ["black 0%", "white 100%"]
					});		
				});
					
			}
	}).dialog("widget");
	jQuery(".ui-dialog-titlebar", d).remove();
	jQuery(".close", d).button();
	
	jQuery('#grad_dir button').each(function(i, val){
		var icon = {primary: jQuery(this).data("icon")};
		jQuery(this).button({
			icons : icon,
			text: false
			});
		
	}).on("click", function(e){
			jQuery("#grad_dir button").data('toggle', "off");
			jQuery(this).data('toggle', "on");
			console.log(jQuery(this).data('toggle'));
	});
	
	//icons: {
			//primary: "ui-icon-arrowthick-2-n-s"
			//},
			//text: false
	//});
	//jQuery('[data*="leftToRight"]').button({
		//icons: {
			//primary: ""
			//},
			//text: false
	//});
	//jQuery('[data*="topLeftToBottomRight"]').button({
		//icons: {
			//primary: " ui-icon-arrowthick-2-se-nw"
			//},
			//text: false
	//});
	//jQuery('[data*="topRightToBottomLeft"]').button({
		//icons: {
			//primary: "ui-icon-arrowthick-2-ne-sw"
			//},
			//text: false
	//});
	
	
	console.log(d);
	
	return id;
}
function colorpicker_handler(v){
	//jQuery(".color:visible").css("background-color", v);
	jQuery("span.color").css("background-color", '#'+v).text("");
	var canvas = Drupal.settings.canvas_view.canvas;
	var active = canvas.getActiveObject();
	
	if(typeof(active) !== "undefined"){
		active.fill = "#"+v;
		canvas_render();
	}
}
function handle_gradient(points, styles,background){
	var colorStops = {},  colorOptions = {};
		canvas = Drupal.settings.canvas_view.canvas,
		active = canvas.getActiveObject(),
		typeof_active = typeof active,
		type = "linear",
		colorOptions = {
			x1 : 0,
			y1 : 0,
			x2 : 0,
			y2 : 0
		},
		//dir = jQuery("#grad_dir").selectmenu("value");
		dir = jQuery("#grad_dir button").filter(function() { 
				return jQuery(this).data("toggle") == "on" 
		}).data("value");
		
		//console.log(dir);
		//dir = "topToBottom";
		if(typeof_active === "object"){
		//	dir = (dir === "" )? "topToBottom" : dir;
			
			if(dir === "leftToRight" ){
				colorOptions.x2 = active.width;
			}
			
			if(dir === "topToBottom" ){
				colorOptions.y2 = active.height;
			}
			if(dir === "topRightToBottomLeft" ){
				colorOptions.x1 = active.width;
				colorOptions.y2 = active.height;
			}
			if(dir === "topLeftToBottomRight" ){
				colorOptions.x1 = active.width;
				colorOptions.y1 = active.height;
				colorOptions.x2 = 0;
				colorOptions.y2 = 0;
			}
			
			//if(dir === "topToBottom" ){
			//leftTop_rightBottom
			
			jQuery(points).each(function(i, val ){	
				colorStops[val.position] = val.color;	
			});		
			//colorOptions.x1 = active.width/2;
			//colorOptions.y1 = active.height / 2;
			//colorOptions.x2 = active.width;
			//colorOptions.y2 = active.height / 2;

			if(type === "radial"){
				//colorOptions.r1 = active.width/4;
				colorOptions.r2 = active.width;
			}

			colorOptions.colorStops = colorStops ;
			colorOptions.type = type ;
			Drupal.settings.canvas_view.coloroptions = colorOptions;
			var background = (typeof background === "undefined") ? false : background;

			if(background){
				canvas.getItemByName("background_grad").setGradient('fill', colorOptions);
			} else {
				active.setGradient('fill', colorOptions);
				
			}
			canvas_render();
		}
}

//misc
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
//function fff(){
//fabric.util.object.extend(fabric.Canvas.prototype, {
    //_searchPossibleTargets: function(e) {

        //// Cache all targets where their bounding box contains point.
        //var target,
            //pointer = this.getPointer(e);

        ///*
        //if (this._activeObject && this._checkTarget(e, this._activeObject, pointer)) {
            //this.relatedTarget = this._activeObject;
            //return this._activeObject;
        //}
        //*/

        //var i = this._objects.length;

        //while(i--) {
            //if (this._checkTarget(e, this._objects[i], pointer)){
                //this.relatedTarget = this._objects[i];
                //target = this._objects[i];
                //break;
            //}
        //}

        //return target;
    //}
//});
//}

//function get_controls(){
	//return {
		//buttons : ["up", "down", "left", "right", "delete"],
		
			
	//};
//}
