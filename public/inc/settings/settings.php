<?php
	/**
	 * Settings for the database
	 * @author Benjamin François
	 */
	$dbhost = 'localhost';
	$dbname = 'js-mmorpg';
	$dbport = 27017;
	$con = new Mongo("mongodb://$dbhost:$dbport");
	$db = $con->selectDB($dbname);
?> 