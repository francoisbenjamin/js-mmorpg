/**
 * Main file
 * @author Benjamin Fran�ois 
 */
$(document).ready(function(){
    var view = new View(new Model(),'#000000', true);
    new Controller(view, view.getModel());
});