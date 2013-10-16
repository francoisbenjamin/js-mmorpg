/**
 * Main file
 * @author Benjamin François 
 */
$(document).ready(function(){
    var view = new View(new Model(),'ffffff', true);
    new Controller(view, view.getModel());
});