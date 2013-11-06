/**
 * Handle delete, creation or display of the characters
 * IMPORTANT : the ids must exist in order to works on your html page
 * You can edit the index.html and this class
 * 
 * @author Benjamin François 
 */
function LoginHud(){
	this.list = $("#list");
	this.characterList = $("#characters_list");
	this.characterCreation =  $("#characterCreation");
	this.characterName = $("#characterName");
	this.newButton = $("#newCharacter");
	this.useButton = $("#useCharacter");
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

/**
 * Return the input for the character's name
 */
LoginHud.prototype.getCharacterName = function() {
	return this.characterName;
};

/**
 * Return the button that cancel the character's creation
 */
LoginHud.prototype.getCancelCreationButton = function() {
	return this.cancelCreationButton;
};

LoginHud.prototype.getUseButton = function() {
	return this.useButton;
};