/**
 * A basic screen for the game
 * it extends the PIXI.displayObjectContainer class
 */
function Screen(){
	PIXI.DisplayObjectContainer.call(this);
}

Screen.constructor = Screen;
Screen.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);