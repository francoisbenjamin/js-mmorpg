/**
 * The server of the game
 * @author Benjamin François
 */

/***********************
 ** Node.js Requirements
 ***********************/
var settings = require("./settings/settings").settings;

var path = require("path"),
Player = require("./server-classes/player/Player").Player,
express = require("express"),
app = module.exports = express(),
util = require("util"),
http = require('http'),
server = http.createServer(app),
mongoStore = require('connect-mongo')(express),
mongoose = require("mongoose"),
port = process.env.PORT || settings.port;
module.exports = { app: app, server: server,};
var sockets;

/*******************
 ** Databases Schema
 *******************/
var accountSchema;
var accountModel;
var playerSchema;
var playerModel;

/******************
 ** Game variables
 *****************/
var players = [];
//var server;

/**********************
 ** Game event handlers
 **********************/
function setEventHandlers(){
	sockets.on("connection", onSocketConnection);
}

function onSocketConnection(client){
	util.log("A new player has connected : " + client.id);
	
	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);
	
	// Listen for move player message
	client.on("move player", onMovePlayer);
	
	// Listen for new player message
	client.on("new player", onNewPlayer);
}

// Socket client has disconnected
function onClientDisconnect(){
	var removePlayer = playerById(this.id);
	
	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+ this.id);
		return;
	}
	else {
		util.log("'"+removePlayer.getName() +"' has disconnected : " + this.id);
	}

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
}

//Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+ this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
}

//New player has joined
function onNewPlayer(data) {
	util.log("'" + data.name +"' has connected  id : " + this.id + " coord :  x : " + data.x + " y : " + data.y);
	// Create a new player
	var newPlayer = new Player(data.name, data.x, data.y);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, name : data.name, x: newPlayer.getX(), y: newPlayer.getY()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	};
		
	// Add new player to the players array
	players.push(newPlayer);
}

// When someone send a message on the game
function onSendMessage(data){
	//TODO 
}

/************************
 ** Game helper functions
 ************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};

/**********************
 ** Game initialization
 **********************/
function init(){
	/*************************
	 ** Database configuration
	 *************************/
	// TODO Add an user for the database
	mongoose.connect("mongodb://localhost/js-mmorpg", function(err){
		if(err){ throw err;}
	});
	
	// The data for the player in the database
	playerSchema = new mongoose.Schema({
		name : {type : String, unique: true},
		level : {type : Number, default : 1, min : 1, max: 99},
		spawn_x : {type : Number, default : 100},
		spawn_y : {type : Number, default : 100},
		hp : Number,
		x : {type : Number, default : 100},
		y : {type : Number, default : 100},
		exp : {type : Number, default : 0, min: 0},
		
		});
	
	accountSchema = new mongoose.Schema({
		login : {type: String, unique: true},
		password : {type: String},
		email: {type: String, match: /^[a-z|0-9|A-Z]*([_][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*(([_][a-z|0-9|A-Z]+)*)?@[a-z][a-z|0-9|A-Z]*\.([a-z][a-z|0-9|A-Z]*(\.[a-z][a-z|0-9|A-Z]*)?)$/},
		players : [playerSchema],
		last_log : {type: Date}
	});

	// The account model
	accountModel = mongoose.model('accounts', accountSchema);
	accountModel.findOne({login: 'admin'}, function (err, user) {
		  if (err) {
		     console.log(err.name);
		     return;
		  }
		  
		  if (!user){
			// Create an admin account if it doesn't exist
			var newAccount = new accountModel();
			newAccount.login = 'admin';
			newAccount.password = 'admin';
			newAccount.last_log =  Date.now();
			newAccount.save(function (err) {
				  if (err) { throw err; }
				  util.log('Account added !');
				});
			
		    return;
		  }
		});
	// The player model for the data
	playerModel = mongoose.model('players', playerSchema);
	
	// Close mongoDB connection
	mongoose.connection.close();
	
	
	// Create a line
//	var newplayer = new playerModel({ name : 'Shinochi'});
//	newplayer.level = 10;
//	newplayer.spawn_x = 50;
//	newplayer.spawn_y = 40;
//	newplayer.x = 50;
//	newplayer.y = 90;
//	newplayer.exp = 100;

	// Insert into the database
//	newplayer.save(function (err) {
//	  if (err) { throw err; }
//	  console.log('Player added !');
//	  // Close mongoDB connection
//	  mongoose.connection.close();
//	});
	
	/* END WIP */
	
	/***********************
	 ** Server configuration
	 ***********************/
	app.configure(function() {
		this.use(express.static(path.join(__dirname, '/public')));
		// Allow parsing cookies from request headers
		this.use(express.cookieParser());
		
		// Session Management
		this.use(express.session({
			// Private crypting key
			// You'll need to change it
			"secret" : settings.secret,
			"store" : new mongoStore({db : settings.db,  port: settings.db_port})
		}));
	});
	
	app.configure('development', function(){
	  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
	
	app.configure('production', function(){
	  this.use(express.errorHandler());
	});
	
	// Configuration of the server
	app.configure(function() {
		app.set('port', port);
		app.set("transports", ["websocket"]);
	});
	
	// listen for new web client
	// Set log level to 3 for debug
	sockets = require('socket.io').listen(server, {"log level" : 2});
	
	server.listen(port, function () {
		 util.log('############################################');
	     util.log(' Server started successfully on '+ port + '!');
	     util.log('############################################');
	   });
	
	setEventHandlers();
}

init();
