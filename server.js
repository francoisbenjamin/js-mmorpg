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
}

// Socket client has disconnected
function onClientDisconnect(){
	util.log("Player has disconnected : " + this.id);
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
};

/******************
 ** Game variables
 *****************/
var players = [];
var server;

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
