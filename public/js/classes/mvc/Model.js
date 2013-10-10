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