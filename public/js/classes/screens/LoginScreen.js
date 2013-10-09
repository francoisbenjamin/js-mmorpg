/**
 * A simple login screen
 * extends Screen
 * it use the <div> with the 'log-in' id
 */
function LoginScreen(){
	Screen.prototype.call(this);
}

LoginScreen.constructor = LoginScreen;
LoginScreen.prototype = Object.create(Screen.prototype);