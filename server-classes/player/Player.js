/**
 * Game Player Class
 * extends {PIXI.Sprite}
 * @param texture {String}
 * @author Benjamin François 
 */
function Player(){
	this.id;
	this.level = 1;
	this.x;
	this.y;
}

// GETTERS
/**
 * Get the player id
 * @returns {String}
 */
Player.prototype.getId = function(){
	return this.id;
};

/**
 * Get the level of the player
 * @returns {Number}
 */
Player.prototype.getLevel = function(){
	return this.level;
};

/**
 * Get the x of the player
 * @returns {Number}
 */
Player.prototype.getX = function(){
	return this.x;
};

/**
 * Get the y of the player
 * @returns {Number}
 */
Player.prototype.getY = function(){
	return this.y;
};

// SETTERS
/**
 * Set the level of the player
 * @param {Number}
 */
Player.prototype.setLevel = function(level){
	this.level = level;
};

/**
 * Set the x of the player
 * @param x {Number}
 */
Player.prototype.setX = function(x){
	this.x = x;
};

/**
 * Set the y of the player
 * @param y {Number}
 */
Player.prototype.setY = function(y){
	this.y = y;
};

exports.Player = Player;