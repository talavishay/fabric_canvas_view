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
	$node =  node_load($_POST["nid"]);
	$node->field_canvas["und"]["0"]["rgb"] = $_POST["layout_data"];
	node_save($node);
}

function _save_upload(){
	global $user;
	$success = array();
    $num_files = count($_FILES['files']['name']);
	$nid =  is_int(intval($_POST["nid"])) ? $_POST["nid"] : 0 ;
    
    for ($i = 0; $i < $num_files; $i++) {
        $file = file_save_upload($i, array(),'private://');
        if($nid){
//        	file_usage_add($file, 'file', 'node', $nid);
        	_add_image_to_node($file, $nid);
        	$file->url = file_create_url($file->uri);
        }
        if ($file) {
        	$success[$i] = $file;
        } else {
            $success[$i] = t('Failed to write the uploaded file to the site\'s private file folder.');
        }   
    }
    if($num_files === 0){
    	$success = "no files in upload request";
    }
	echo json_encode($success);
}
function _uri_2_url($fid){
	$file = file_load($fid);
	echo  file_create_url($file->uri);
	
}
function filter_delete($var){
	global $fid;
	if($var){
	return false;
	}else{
	return true;
		
	}	
}
function _delete_fid($fid,$nid){
	$res = file_delete(file_load($fid), true);
if($res){
	$node_wrapper = entity_metadata_wrapper('node', $nid);
	$img = $node_wrapper->field_img->raw();
	//$filtered_img = array_filter($img, function($elem) use($fid){
	$filtered_img = array_filter($img, function($elem) use($fid){
		if($elem["fid"] === $fid){	
			return false;
		} else {
			return true;
		}
    }); 
	$node_wrapper->field_img = $filtered_img ;
	$node_wrapper->save();
	echo $res;
}
}
function _add_image_to_node($file, $nid){
	
	$node_wrapper = entity_metadata_wrapper('node', $nid);
	//$info = $node_wrapper->getPropertyInfo();
	
	$node_wrapper->field_img[] = array('fid' => $file->fid);
	$node_wrapper->save();
}
