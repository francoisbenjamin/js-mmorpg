<?php 
	/**
	 * Add the new account to the database
	 * @author Benjamin François
	 */
	include_once "inc/settings/settings.php";
	require_once 'inc/fct.inc.php';
	
	// Validate the information of the account
	validAccount($_POST);
?>