<?php
	/**
	 * All the helpers for the registration of new accounts
	 * @author Benjamin François 
	 */

	/**
	 * Validate the new account
	 * @param Array $post
	 */
	function validAccount($post){
		$valid = true;
		if(!isset($post)){
			$valid = false;
		}
		
		$login = trim($post['login']);
		$password = trim($post['password']);
		$password_confirmation = trim($post['password_confirmation']);
		$email = trim($post['email']);
		$email_confirmation = trim($post['email_confirmation']);
		
		// Login part
		if (empty($login)) {
			$valid = false;
		}
		else {
			if (accountExist($login)) {
				$valid = false;
			}
		}
		
		// Password part
		if(empty($password)){
			$valid = false;
		}else {
			if($password != $password_confirmation){
				$valid = false;
			}
		}
		
		// Email part
		if(empty($email)){
			$valid = false;
		}else {
			if($email != $email_confirmation){
				$valid = false;
			}
		}
		
		// If valid, add in the database
		if($valid){
			addAccount(array("login"=>$login, "password"=>$password, "email"=>$email));
		}
		else {
			header("location:../register.php");
		}
	}
	
	/**
	 * Add the account to the database 
	 * @param Array $account
	 */
	function addAccount($account){
		include "/settings/settings.php";
		
		$accounts = $db->selectCollection("accounts");
		
		$insertOptions = array(
				'safe'    => true,
				'fsync'   => true,
				'timeout' => 10000
		);
		
		try{
			$accounts->insert($account);
			echo"gg";
		}
		catch(MongoCursorException $e){
			echo $e->getMessage()."<br/>";
			exit();
		}
		catch (MongoCursorTimeoutException $e){
			echo $e->getMessage()."<br/>";
			exit();
		}
		
		foreach ($accounts->find() as $doc){
			var_dump($doc);
		}
	}
	
	function accountExist($account){
		include "/settings/settings.php";
		$accounts = $con->selectCollection($dbname,"accounts");
		$exist = false;
		$user = array (
			'login' => $account
		);
		
		$user = $accounts->findOne($user);
		
		// Check if the login don't exist
		if (strtoupper($user['login']) == strtoupper($account)) {
			$exist= true;
		}

		return $exist;
	}
?>