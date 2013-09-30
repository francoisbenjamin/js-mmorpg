/**
 * The main View of the game
 * it need to know the model and extends the PIXI.Stage class
 */
 
 function View(model, backgroundColor, interactive){
    PIXI.Stage.call(this, backgroundColor, interactive);
    this.model = model;
 }
 
 View.prototype = Object.create(PIXI.Stage.prototype);
 View.prototype.constructor = View;
 
 /**
  * Get the model's view
  * returns {Model}
  */
 View.prototype.getModel = function(){
    return this.model;
 };