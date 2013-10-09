/**
 * The class that handle all the screens of the game
 */
function ScreenManager(){
	// TODO WIP
	this.currentScreen = null;
	this.screenList = [];
}

// GETTERS
/**
 * Return the current screen
 * @returns {Screen}
 */
ScreenManager.prototype.getScreen = function(){
	return this.currentScreen;
};
/**
 * Change the screen displayed
 * @param nextScreen {Screen}
 */
ScreenManager.prototype.setScreen = function(nextScreen){
	this.currentScreen = nextScreen;
};


