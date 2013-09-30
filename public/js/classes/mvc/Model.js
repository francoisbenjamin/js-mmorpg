/**
 * The Model of the game
 * it contains the local data of the game
 * @author Benjamin François 
 */
function Model(){
	this.remotePlayers = [];
	this.player;
}

// GETTERS

/**
 * Return the list of player online
 * @returns {Array}
 */
Model.prototype.getRemotePlayers = function(){
	return this.remotePlayers;
};

// SETTERS

/**
 * Define the new player list
 * @param players {Array}
 */
Model.prototype.setRemotePlayers = function(remotePlayers){
	this.premotePlayers = remotePlayers;
};