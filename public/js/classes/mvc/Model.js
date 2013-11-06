/**
 * The Model of the game
 * it contains the local data of the game
 * @author Benjamin François
 */
function Model(){
	this.remotePlayers = [];
	this.player;
	this.spawn = new PIXI.Point(0, 0);
}

// GETTERS

/**
 * Return the list of player online
 * @returns {Array}
 */
Model.prototype.getRemotePlayers = function(){
	return this.remotePlayers;
};

/**
 * Return the local player
 * @returns {Player}
 */
Model.prototype.getLocalPlayer = function(){
	return this.player;
};


/**
 * Return the spawn coordinates of the player
 * @returns {PIXI.Point}
 */
Model.prototype.getSpawn = function(){
	return this.spawn;
};

// SETTERS

/**
 * Define the new player list
 * @param players {Array}
 */
Model.prototype.setRemotePlayers = function(remotePlayers){
	this.premotePlayers = remotePlayers;
};

/**
 * Set the new local player
 * @param player {Player}
 */
Model.prototype.setLocalPlayer = function(player){
	this.player = player;
};

/**
 * Set the new spawn coordinates
 * @param spawn {PIXI.Point}
 */
Model.prototype.setSpawn = function(spawn){
	this.spawn = spawn;
};

/**
 * Return the array of characters
 * @returns {Array}
 */
Model.prototype.getCharacters = function(account, password){
	var characters;
	$.ajax({
		type: "POST",
		async: false,
		data: { login: $.trim(account), password: $.trim(password)},
		url: "http://" + settings.host+ ":" + settings.port + "/connexion",
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
	return characters;
};