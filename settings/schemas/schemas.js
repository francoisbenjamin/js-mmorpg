/**
 * Database schemas
 * @author Benjamin François
 */
var mongoose = require("mongoose");
/**
 * Player's Schema
 */
var PLAYER_SCHEMA = {
	name : {type : String, unique: true , dropDups: true},
	level : {type: Number, default : 1, min: 1, max: 99},
	spawn_x : {type: Number, default: 100},
	spawn_y : {type: Number, default: 100},
	hp : {type: Number, min: 0},
	mp : {type: Number, min: 0},
	map : {type: String},
	x : {type: Number, default: 100},
	y : {type: Number, default: 100},
	exp : {type: Number, default: 0, min: 0},
	respawn_time : {type: Number, default: 0, min: 0}
};

var PlayerSchema = new mongoose.Schema(PLAYER_SCHEMA);
exports.PlayerSchema = PlayerSchema;

/**
 * Account's Schema
 */

var ACCOUNT_SCHEMA = {
		login : {type: String, unique: true, dropDups: true},
		password : {type: String},
		email: {type: String},
		characters: [PlayerSchema],
		last_log : {type: Date}
};

var AccountSchema = new mongoose.Schema(ACCOUNT_SCHEMA);

exports.AccountSchema = AccountSchema;