<?php
	/**
	 * Return the account's data
	 * @author Benjamin François
	 */
	require_once "fct.inc.php";
	
	extract ( $_POST );
	
	if (! isset ( $login )) {
		header ( "location:../register.php" );
		exit ();
	}
	
 	$arr = array('exist' => accountExist($login));
	echo json_encode ($arr);
	?>