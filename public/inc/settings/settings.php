<?php
	/**
	 * Settings for the database
	 * @author Benjamin François
	 */
	$dbhost = 'localhost';
	$dbname = 'js-mmorpg'
	$con = new Mongo("mongodb://$dbhost");
	$db = $con->js-mmorpg;
	var_dump($con->listDBs());
?> 