/**
 * A simple login screen
 * extends Screen
 * it use the <div> with the 'log-in' id
 */
function LoginScreen(){
	this.login = false;
}

/**
 * Set if the client is logged or not
 */
LoginScreen.prototype.connect = function(){
	$.ajax({
		type: "POST",
		async: false,
		data: { login: $.trim($("#login").val())},
		url: "inc/getAccount.inc.php",
		dataType: "json",
		success: function(data){
			if(data.exist){
				error_msg += "The login exist already.<br/>";
				valid = false;
			}
		}
	});
	
	this.login = login;
};

/**
 * Return if the client is logged or not
 * @returns {Boolean}
 */
LoginScreen.prototype.isLogged = function(){
	return this.login;
};


