/**
 * The controller of the game, it need to know the view and the model
 * @param view {View}
 * @param model {Model}
 * @author Benjamin François 
 */
function Controller(view, model){
    var _view = this.view = view;
    this.model = model;
    var scope = this;
    /******************
     ** Load the assets
     ******************/
    this.assetsToLoader = ["assets/sprites.json"];
	this.loader = new PIXI.AssetLoader(this.assetsToLoader);
	this.loader.onComplete = onAssetsLoaded;
	this.loader.load();
    
    var _socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
    // Add the stage to the page
    document.body.appendChild(view.getRenderer().view);
    
    // Set the spawn coordinates for the player
    _view.getModel().setSpawn(new PIXI.Point(_view.getGameScreenWidth() / 2, _view.getGameScreenHeight() / 2));
    
    /**********************
     ** Game event handlers
     **********************/
    
    /**
     * Socket connected
     */
    var onSocketConnected = function() {
    	// Send local player data to the game server
    	_socket.emit("new player", {x: 45, y: 5, name: _view.getModel().getLocalPlayer().getName()});
    	console.log("Connected to socket server");
    };
    
    var setEventHandlers = function(){
    	// Socket connection successful
    	_socket.on("connect", onSocketConnected);
    };
    
    /***********************
    ** Game helper functions
    ************************/
    // Find player by ID
    var playerById = function(id) {
    	var i;
    	for (i = 0; i < remotePlayers.length; i++) {
    		if (remotePlayers[i].id == id)
    			return remotePlayers[i];
    	};
    	
    	return false;
    };
    
    /**
     * Main loop
     */
    this.main = function(){
    	_view.getRenderer().render(_view);
		requestAnimFrame(scope.main);
    };
    
    /**
     * When the assets are loaded, start the game
     */
    function onAssetsLoaded(){
	 // Set the local player to the spawn
	    _view.getModel().setLocalPlayer(new Player(_view.getModel().getSpawn(), "Shinochi", 60));
	    _view.addEntity(_view.getModel().getLocalPlayer());
	    setEventHandlers();
	    requestAnimFrame(scope.main);
    };
}

/**
 * Pause Mousetrap
 */
Controller.prototype.ignoreUser = function(){
	Mousetrap.pause();
};


/**
 * Unpause Mousetrap
 */
Controller.prototype.listenUser = function(){
	Mousetrap.unpause();
};
