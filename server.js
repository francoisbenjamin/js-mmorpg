/**
 * The server of the game
 * @author Benjamin François 
 */

/**
 * Node.js Requirements
 */
var util = require("util"),
http = require('http'),
io = require('socket.io'),
Player = require("./server-classes/player/Player").Player;

/******************
 ** Game variables
 *****************/
var players = [];
var server;

/**********************
 ** Game event handlers
 **********************/
function setEventHandlers(){
	server.sockets.on("connection", onSocketConnection);
}

function onSocketConnection(client){
	util.log("New player has connected : " + client.id);
	
	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);
	
	// Listen for move player message
	client.on("move player", onMovePlayer);
	
	// Listen for new player message
	client.on("new player", onNewPlayer);
}

// Socket client has disconnected
function onClientDisconnect(){
	util.log("Player has disconnected : " + this.id);
	
	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+ this.id);
		return;
	};

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
	util.log("Added "+ data.name +" : " + this.id + " on x : " + data.x + " y : " + data.y);
	// Create a new player
	var newPlayer = new Player(data.x, data.y);
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
	// listen for new web clients:
	server = io.listen(8000);

	// Configuration of the server
	server.configure(function() {
		server.set('port', process.env.PORT || 5000);
		server.set("transports", ["websocket"]);
		// Restrict log output
		server.set("log level", 2);
	});
	
	setEventHandlers();
}

init();
