/**
 * The main View of the game
 * it need to know the model and extends the PIXI.Stage class
 * @author Benjamin François
 */
 
 function View(model, backgroundColor, interactive){
    PIXI.Stage.call(this, backgroundColor, interactive);
    this.model = model;
    this.hud;
    this.gameScreenWidth = $(document).width();
    this.gameScreenHeight = $(document).height();
    this.renderer = PIXI.autoDetectRenderer(this.gameScreenWidth, this.gameScreenHeight, null);
 }
 
 View.prototype = Object.create(PIXI.Stage.prototype);
 View.prototype.constructor = View;
 
 
 // GETTERS
 /**
  * Get the model's view
  * @returns {Model}
  */
 View.prototype.getModel = function(){
    return this.model;
 };
 
 /**
  * Get the screen's width
  * @returns {Number}
  */
 View.prototype.getGameScreenWidth = function(){
	return this.gameScreenWidth; 
 };
 
 /**
  * Get the screen's height
  * @returns {Number}
  */
 View.prototype.getGameScreenHeight = function(){
	 return this.gameScreenHeight;
 };
 /**
  * Return the renderer of the game
  * it can be a canvas renderer or a WebGL renderer
  * @returns {renderer}
  */
 View.prototype.getRenderer = function(){
	return this.renderer; 
 };

// SETTERS
 /**
  * Set the model's view
  * @param model {Model}
  */
 View.prototype.setModel = function(model){
	this.model = model; 
 };
 
 /**
  * Add an entity to the view
  * @param entity
  */
 View.prototype.addEntity = function(entity){
	 PIXI.Stage.prototype.addChild.call(this, entity); 
 };