/**
 * Register the new account
 * @author Benjamin François 
 */
$(document).ready(function(){
	$("#submit").click(validForm);
});

/**
 * A simple validation
 */
function validForm(){
	var valid = true;
	var error_msg = "";
	// Login part
	if(!$.trim($("#login").val()).length){
		error_msg += "The login can't be empty.<br/>";
		valid = false;
	}
	else {
		// TODO Check if the login exist
	}
	
	// Password part
	
	if(!$.trim($("#password").val()).length){
		error_msg += "The password can't be empty.<br/>";
		valid = false;
	}else {
		if($("#password").val() != $("#password_confimartion").val()){
			error_msg += "The password must be the same.\n";
			valid = false;
		}
	}
	
	// Email part
	
	if(!$.trim($("#email").val()).length){
		error_msg += "The email can't be empty.<br/>";
		valid = false;
	}else {
		if($("#email").val() != $("#email_confimartion").val()){
			error_msg += "The email must be the same.\n";
			valid = false;
		}
	}
	
	if(valid){
		$("#error").show();
		$("#registration").submit();
	}
	else {
		$("#error").show();
		$("#error").html(error_msg);
	}
}