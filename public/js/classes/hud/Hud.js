/**
 * Game's Hud
 * @author Benjamin François
 */
function Hud(loginHud){
	this.loginHud = loginHud;
}

/**
 * Return the login hud
 * @returns {LoginHud}
 */
Hud.prototype.getLoginHud = function(){
	return this.loginHud;
};