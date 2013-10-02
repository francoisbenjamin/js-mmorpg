/**
 * Animate a Sprite with sequences
 */
function AdvancedMovieClip(sequences, frameRate, firstSequence) {
	this.sequences = sequences;
	if (firstSequence == undefined) {
		for ( var key in sequences) {
			this.currentSequence = key;
			break;
		}
	} else {
		this.currentSequence = firstSequence;
	}
	PIXI.Sprite.call(this, this.sequences[this.currentSequence][0]);
	this.anchor.x = this.anchor.y = .5;
	this.frameRate = frameRate || 30;
	this.onComplete = null;
	this.currentFrame = 0;
	this.previousFrame;
	this.playing = false;
	this.loop = false;
}
// AdvancedMovieClip
AdvancedMovieClip.constructor = AdvancedMovieClip;
AdvancedMovieClip.prototype = Object.create(PIXI.Sprite.prototype);

AdvancedMovieClip.prototype.gotoAndPlay = function(where) {
	if (Object.prototype.toString.call(where) == '[object String]') {
		this.currentFrame = 0;
		this.currentSequence = where;
	} else {
		this.currentFrame = where;
	}
	this.playing = true;
};

AdvancedMovieClip.prototype.gotoAndStop = function(where) {
	if (Object.prototype.toString.call(where) == '[object String]') {
		this.currentFrame = 0;
		this.currentSequence = where;
	} else {
		this.currentFrame = where;
	}
	this.setTexture(this.sequences[this.currentSequence][this.currentFrame]);
	this.playing = false;
};

AdvancedMovieClip.prototype.play = function() {
	this.playing = true;
};

AdvancedMovieClip.prototype.stop = function() {
	this.playing = false;
};

AdvancedMovieClip.prototype.sequencePlayed = function() {
	var sequence = null;
	sequence = this.currentSequence;
	return sequence;
};

AdvancedMovieClip.prototype.advanceTime = function(dt) {

	if (typeof dt == "undefined") {
		dt = 1 / 600;
	}

	if (this.playing) {
		this.currentFrame += this.frameRate * dt;

		var constrainedFrame = Math.floor(Math.min(this.currentFrame,
				this.sequences[this.currentSequence].length - 1));
		this.setTexture(this.sequences[this.currentSequence][constrainedFrame]);

		if (this.currentFrame >= this.sequences[this.currentSequence].length) {
			if (this.loop) {
				this.gotoAndPlay(0);
			} else {
				this.stop();
			}
			if (this.onComplete) {
				this.onComplete(this.currentSequence);
			}
		}
	}
};

AdvancedMovieClip.prototype.updateTransform = function() {
	PIXI.Sprite.prototype.updateTransform.call(this);
	this.advanceTime();
};