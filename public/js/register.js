$(document).ready(function(){
	$("#submit").click(validForm);
});

/**
 * A simple validation
 */
function validForm(){
	$("#error").show();
}