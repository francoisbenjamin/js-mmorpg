/**
 * The controller of the game, it need to know the view and the model
 * @param view {View}
 * @param model {Model}
 * @author Benjamin François
 */
function Controller(view, model){
    var _view = this.view = view;
    var scope = this;
    var _socket;
    this.model = model;
    this.screenManager = new ScreenManager();
    
    /******************
     ** Load the assets
     ******************/
    this.assetsToLoader = ["assets/sprites.json"];
	this.loader = new PIXI.AssetLoader(this.assetsToLoader);
	this.loader.onComplete = onAssetsLoaded;
	this.loader.load();
    
    // Add the stage to the page
    document.body.appendChild(view.getRenderer().view);
    
    // Set the spawn coordinates for the player
    _view.getModel().setSpawn(new PIXI.Point(Math.round(Math.random()*(_view.getGameScreenWidth() - 20)), Math.round(Math.random()*(_view.getGameScreenHeight() - 20))));
    
    /**********************
     ** Game event handlers
     **********************/
    
    /******************
     * Socket connected
     ******************/
    var onSocketConnected = function() {
    	// Send local player data to the game server
    	_socket.emit("new player", {x: _view.getModel().getSpawn().x, y: _view.getModel().getSpawn().y, name: _view.getModel().getLocalPlayer().getName()});
    	console.log("Connected to socket server");
    };
    
	/************
	 * New player
	 ************/ 
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
    
    //Browser window resize
    function onResize(e) {
    	_view.getRenderer().resize(window.innerWidth,  window.innerHeight);
    };
    
    /**
     * Socket disconnected
     */
    var onSocketDisconnect = function() {
    	console.log("Disconnected from socket server");
    };
    
    /**
     * When the client is already log in
     */
    var onPreventLogin = function(){
    	$(".error").show();
		$(".error").html("This account is already connected.");
		_socket.disconnect();
    };
    
   /**
    * Check if the character can be create
    */
    var createNewCharacter = function(){
    	$.ajax({
			type: "POST",
			async: false,
			data: { login: $.trim($("#login").val()),characterName: $.trim($("#characterName").val())},
			url: "http://localhost:8000/createcharacter",
			dataType: "json",
			success: function(data){
				if(!data.done){
					$(".error").show();
					$(".error").html("The character already exist");
				}
				else {
					//Load the character
				}
			}
		});
    };
    
    /**
     * Show the new character's form 
     */
    var showNewCharacterForm = function(){
    	_view.getHud().getLoginHud().getList().hide();
    	_view.getHud().getLoginHud().getCharacterCreation().show();
    };
    
    /**
     * Cancel the character's creation
     */
    var cancelCreation = function(){
    	
    };
    
    /**
     * 
     */
    function authentified(_login){
    	console.log("trying to connect...");
    	_socket = io.connect("http://"+settings.host, {port: settings.port, transports: ["websocket"]});
    	_socket.socket.on('error', function (reason){
    		console.error('Unable to connect Socket.IO', reason);
    		_socket.disconnect();
    	});
    	setEventHandlers();
    	
    	_socket.emit("authentication", {login : _login}, function(result){
    		// If the account is not online yet
			_view.getHud().getLoginHud().hideLogin();
			$(".error").hide();
			// Show the Character view
			_view.getHud().getLoginHud().showCharacters();
			$("#characters_list").html(' ');
			
			if(result.characters == null){
				_view.getHud().getLoginHud().getCharactersList().hide();
			}
			else {
				console.log("Characters...");

				_view.getHud().getLoginHud().getCharactersList().show();
				var max = result.characters.length;
				for (var i = 0; i < max; i++) {
					$("#characters_list").append("<option>"+result.characters[i].name + "</option>");
				}
			}
			// Create a new character
			_view.getHud().getLoginHud().getNewButton().click(showNewCharacterForm);
			_view.getHud().getLoginHud().getCreateButton().click(createNewCharacter);
			_view.getHud().getLoginHud().getCancelCreationButton().click(cancelCreation);
			setEventHandlers();
			console.log("Connected...");
    	});
    }
    
    
    var setEventHandlers = function(){
    	// Window resize
    	$(window).resize(onResize);
    	// Socket connection successful
//    	_socket.on("connect", onSocketConnected);
    	// New player message received
    	_socket.on("new player", onNewPlayer);
    	
    	 // Socket disconnection
    	_socket.on("disconnect", onSocketDisconnect);
    	
    	// Player removed message received
    	_socket.on("remove player", onRemovePlayer);
    	
    	// Prevent the client to connect 
    	_socket.on("preventLogin", onPreventLogin);
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
     * Check if the client can sign in
     */
    function onSubmit(){
    	var error_msg = "";
    	var valid = true;
    	
    	// Login part
    	if(!$.trim($("#login").val()).length){
    		error_msg += "The login can't be empty.<br/>";
    		valid = false;
    	}
    	
    	// Password part
    	if(!$.trim($("#password").val()).length){
    		error_msg += "The password can't be empty.<br/>";
    		valid = false;
    	}
    	
    	if(valid){
    		$.ajax({
    			type: "POST",
    			async: false,
    			data: { login: $.trim($("#login").val()), password: $.trim($("#password").val())},
    			url: "http://localhost:8000/connexion",
    			dataType: "json",
    			success: function(data){
    				if(!data.valid){
    					$(".error").show();
    					$(".error").html("The login or the password is not valid.");
    					valid = false;
    				}
    				else {
    					// The client is authentified
    					authentified($.trim($("#login").val()));
    				}
    			}
    		});
    	}
    	else {
    		$(".error").show();
			$(".error").html(error_msg);
    	}
    }
    
    /**
     * When the assets are loaded, start the game
     */
    function onAssetsLoaded(){
    	// Display the login hud
    	_view.getHud().getLoginHud().showLogin();
    	$('#log-in').css('display','block');
    	// Wait for login
    	$('#submit').click(onSubmit);
    	
    	// Set the local player to the spawn
//	    _view.getModel().setLocalPlayer(new Player(_view.getModel().getSpawn(), "Shinochi", 60));
//	    _view.addEntity(_view.getModel().getLocalPlayer());
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

/**
 * Reset the game
 */
Controller.prototype.reset = function(){
	// TODO reset the game
};
