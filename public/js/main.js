/**
 * Main file
 * @author Benjamin François 
 */
$(document).ready(function(){
	if($("html").attr("log") != "on"){
		var view = new View(new Model(),'ffffff', true);
		new Controller(view, view.getModel());
	}
	else {
		$("#log-in").hide();
	}
});