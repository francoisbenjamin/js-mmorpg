/**
 * Local Player
 * extends AdvancedMovieClip
 * @param spawn {PIXI.Point} the coordinate of the spawn point for the player
 * @param name {String} the player's name
 * @param texture {String}
 * @author Benjamin François 
 */
function Player(spawn, name, frameRate, firstSequence){
	this.sequences = {
	  "idle_up":[PIXI.Texture.fromFrame("idle_up.png")],
	  "idle_down":[PIXI.Texture.fromFrame("idle_down.png")],
	  "idle_left":[PIXI.Texture.fromFrame("idle_left.png")],
	  "idle_right":[PIXI.Texture.fromFrame("idle_right.png")]
	};
	AdvancedMovieClip.call(this, this.sequences, frameRate, firstSequence);
	this.id;
	this.level;
	this.name = name;
	this.position = spawn;
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
}

Player.constructor = Player;
Player.prototype = Object.create(AdvancedMovieClip.prototype);

//SETTERS
/**
 * Set the new player's texture
 * @param texture {String}
 */
Player.prototype.setTexture = function(texture){
	//TODO set the texture
};

/**
 * Set the new player's level
 * @param level {Number}
 */
Player.prototype.setLevel = function(level){
	this.level = level;
};

//GETTERS
/**
 * Get the name of the player
 * @returns {String}
 */
Player.prototype.getName = function(){
	return this.name;
};