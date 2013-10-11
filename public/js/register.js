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
		// Check if the account don't exist already
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
	}
	
	// Password part
	
	if(!$.trim($("#password").val()).length){
		error_msg += "The password can't be empty.<br/>";
		valid = false;
	}else {
		if($("#password").val() != $("#password_confirmation").val()){
			error_msg += "The password must be the same.<br/>";
			valid = false;
		}
	}
	
	// Email part
	if(!$.trim($("#email").val()).length){
		error_msg += "The email can't be empty.<br/>";
		valid = false;
	}else {
		if($("#email").val() != $("#email_confirmation").val()){
			error_msg += "The email must be the same.<br/>";
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