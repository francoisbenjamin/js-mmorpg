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
    _view.getModel().setSpawn(new PIXI.Point(Math.round(Math.random()*(_view.getGameScreenWidth() - 20)), Math.round(Math.random()*(_view.getGameScreenHeight() - 20))));
    
    /**********************
     ** Game event handlers
     **********************/
    
    /**
     * Socket connected
     */
    var onSocketConnected = function() {
    	// Send local player data to the game server
    	console.log(_view.getModel().getSpawn().x);
    	_socket.emit("new player", {x: _view.getModel().getSpawn().x, y: _view.getModel().getSpawn().y, name: _view.getModel().getLocalPlayer().getName()});
    	console.log("Connected to socket server");
    };
    
    /**
     * New player
     */ 
   var onNewPlayer = function(data) {
    	console.log("New player connected: "+ data.id);

    	// Initialise the new player
    	var newPlayer = new Player(new PIXI.Point(data.x, data.y), data.name, 60);
    	newPlayer.id = data.id;
    	_view.addEntity(newPlayer);
    	// Add new player to the remote players array
    	_view.getModel().getRemotePlayers().push(newPlayer);
    };
    
    /**
     * Remove player
     */
    function onRemovePlayer(data) {
    	var removePlayer = playerById(data.id);

    	// Player not found
    	if (!removePlayer) {
    		console.log("Player not found: " + data.id);
    		return;
    	};

    	// Remove player from array
    	_view.getModel().getRemotePlayers().splice(_view.getModel().getRemotePlayers().indexOf(removePlayer), 1);
    };
    
    /**
     * Socket disconnected
     */
    var onSocketDisconnect = function() {
    	console.log("Disconnected from socket server");
    };
    
    var setEventHandlers = function(){
    	// Socket connection successful
    	_socket.on("connect", onSocketConnected);
    	
    	// New player message received
    	_socket.on("new player", onNewPlayer);
    	
    	 // Socket disconnection
    	_socket.on("disconnect", onSocketDisconnect);
    	
    	// Player removed message received
    	_socket.on("remove player", onRemovePlayer);
    };
    
    /***********************
    ** Game helper functions
    ************************/
    // Find player by ID
    var playerById = function(id) {
    	var remotePlayers = _view.getModel().getRemotePlayers();
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
