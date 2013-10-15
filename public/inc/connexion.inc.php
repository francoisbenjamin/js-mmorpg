<?php 
	/**
	 * Check if the user can Sign in
	 * @author Benjamin François
	 */
	require_once "fct.inc.php";
	extract($_POST);
	
	if(!isset($login) || !isset($password)){
		header("location:../register.php");
	}
	
	$arr = array("signIn" => checkAccount($login, $password));
	
	echo json_encode($arr);
?>