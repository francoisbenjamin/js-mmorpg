function LoginHud(){
	this.list = $("#list");
	this.characterList = $("#characters_list");
	this.characterCreation =  $("#characterCreation");
	this.newButton = $("#newCharacter");
	this.createButton = $("#create");
	this.cancelCreationButton = $("#cancelCreation");
}

LoginHud.prototype.showLogin = function() {
	$("#log-in").show();
};

LoginHud.prototype.hideLogin = function() {
	$("#log-in").hide();
};

LoginHud.prototype.showCharacters = function() {
	$("#characters").show();
};

LoginHud.prototype.hideCharacters = function() {
	$("#characters").hide();
};

LoginHud.prototype.getList = function() {
	return this.list;
};

/**
 * Return the character's list
 */
LoginHud.prototype.getCharactersList = function() {
	return this.characterList;
};

/**
 * Return the button for new character 
 */
LoginHud.prototype.getNewButton = function() {
	return this.newButton;
};

/**
 * Return the button for confirm the creation
 */
LoginHud.prototype.getCreateButton = function() {
	return this.createButton;
};

/**
 * Return the button for new character 
 */
LoginHud.prototype.getCharacterCreation = function() {
	return this.characterCreation;
};

LoginHud.prototype.getCancelCreationButton = function() {
	return this.cancelCreationButton;
};