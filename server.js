/**
 * The server of the game
 * @author Benjamin François 
 */

/***********************
 ** Node.js Requirements
 ***********************/

var path = require("path"),
express = require("express"),
app = module.exports = express(),
util = require("util"),
http = require('http'),
server = http.createServer(app),
port = process.env.PORT || 8000,
//io = require('socket.io'),
Player = require("./server-classes/player/Player").Player;
module.exports = { app: app, server: server,};
var sockets;

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
	/***********************
	 ** Server configuration
	 ***********************/
	app.configure(function() {
		this.use(express.static(path.join(__dirname, '/public')));
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
	     util.log('Server started successfully on '+ port + '!');
	   });
	
	setEventHandlers();
}

init();
