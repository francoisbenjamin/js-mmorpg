/**
 * Game Player Class
 * extends {PIXI.Sprite}
 * @param texture {String}
 * @author Benjamin François 
 */
function Player(texture){
	PIXI.Sprite.call(this, PIXI.Texture.fromFrame(texture));
	this.id;
	this.level = 1;
}

Player.prototype.constructor = Player;
Player.prototype = Object.create(PIXI.Sprite.prototype);

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

// SETTERS
Player.prototype.setLevel = function(level){
	this.level = level;
};

exports.Player = Player;