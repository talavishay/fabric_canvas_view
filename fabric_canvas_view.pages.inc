<?php
/**
 * @file
 * TODO Auto generated file, add description.
 */
function file_upload_handler() {
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *///error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');

class CustomUploadHandler extends UploadHandler {
	protected function get_user_id() {
//		@session_start();
//		return session_id();
		global $user;
		return $user->uid;
	}
}

$upload_handler = new CustomUploadHandler(array(
    'user_dirs' => true
));

//$uri = 'public://bower_install_issues.png';
//$contents = @file_get_contents($uri);

//$user_wrapper = entity_metadata_wrapper('user', 1);

//$file = file_save_data($contents, $uri);
///*
 //* $file_info = array(
		//'fid' => $file->fid,
		//'filename' => $file->filename,
		//'filemime' => $file->filemime,
		//'uid' => 1,
		//'uri' => $file->uri,
		//'status' => 1,
		//'display' => 1,
//);
//$x =  entity_metadata_wrapper('user', $user_wrapper);
//*/
//$xyz = $user_wrapper->field_f;//->get();

//$curr_list = $xyz->value();
//if (!$curr_list){
	//$curr_list = array();
//}
//$curr_list[] = $file;

//$xyz->set($curr_list);
//$user_wrapper->save();

  //drupal_json
//var_dump(   $upload_handler);
}

function save_canvas_handler(){
	$nid =  intval($_POST["nid"]);
	$x =  entity_metadata_wrapper('node', $nid);
	$x->field_layout_data = $_POST["layout_data"];
	$x->save();
	$info = $x->getPropertyInfo() ;

	
}
