/**
 * The controller of the game, it need to know the view and the model
 * @param view {View}
 * @param model {Model}
 * @author Benjamin François 
 */
 
function Controller(view, model){
    var _view = view;
    this.model = model;
    var scope = this;
    
    document.body.appendChild(view.getRenderer().view);
    
    _view.getModel().setPlayer(new Player());
    /**
     * Main loop
     */
    this.main = function(){
    	_view.update().render(_view);
		requestAnimFrame(scope.main);
    };
    
    // Init
    requestAnimFrame(scope.main);
}