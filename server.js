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
app = express(),
util = require("util"),
http = require('http'),
connect = require('express/node_modules/connect'),
cookie = require('express/node_modules/cookie'),
mongoStore = require('connect-mongo')(express),
mongoose = require("mongoose"),
sessionStore,
port = process.env.PORT || settings.port;

var parseCookie = require('connect').utils.parseSignedCookie;
var mongooseConnection;
/******************
 ** Game variables
 *****************/
var players = [];
var server, io;

/*******************
 ** Databases Schema
 *******************/
var accountSchema;
var accountModel;
var playerSchema;
var playerModel;

/**********************
 ** Game event handlers
 **********************/
function setEventHandlers(){
	io.sockets.on("connection", onSocketConnection);
}

/**
 * Check if the user is not already logged in
 * @returns boolean
 */
function onAuthAccount(client, callback) {
	util.log("An attempt of connection of the account : " + client.login);
	callback({ exist: true });
}

function onSocketConnection(client){
	// Listen for client authentification
	client.on("authentification", onAuthAccount);
	client.on("auth", onAuthAccount);
	
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
		util.log("Player not found: " + this.id);
		return;
	}
	else {
		util.log("'" + removePlayer.getName() + "' has disconnected : " + this.id);
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
	mongooseConnection = mongoose.connect("mongodb://localhost/js-mmorpg", function(err){
		if(err){ throw err;}
	});
	
	// The data for the player in the database
	playerSchema = new mongoose.Schema({
		name : {type : String, unique: true , dropDups: true},
		level : {type : Number, default : 1, min : 1, max: 99},
		spawn_x : {type : Number, default : 100},
		spawn_y : {type : Number, default : 100},
		hp : Number,
		x : {type : Number, default : 100},
		y : {type : Number, default : 100},
		exp : {type : Number, default : 0, min: 0},
		
		});
	
	accountSchema = new mongoose.Schema({
		login : {type: String, unique: true, dropDups: true},
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
		  }
		  
		  // Create an admin account if it doesn't exist
		  if (!user){
			var newAccount = new accountModel();
			newAccount.login = 'admin';
			newAccount.password = 'admin';
			newAccount.last_log =  Date.now();
			newAccount.save(function (err) {
				  if (err) { throw err; }
				  util.log('Account added !');
				});
			
		  }
		  return;
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
	io = require('socket.io');
	server =  http.createServer(app);
	io = io.listen(server, {"log level": 2});
	sessionStore = new mongoStore({mongoose_connection: mongooseConnection.connections[0],auto_reconnect: true},function(){console.log("connected");});
	
	/***********************
	 ** Server configuration
	 ***********************/
	app.configure(function() {
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.set('port', port);
		app.set("transports", ["websocket"]);
		app.use(app.router);
		app.use(express.static(path.join(__dirname, '/public')));
		// Allow parsing cookies from request headers
		app.set("log level" , 2);
		
		// Session Management
		app.use(express.session({
			// Private crypting key
			// You'll need to change it
			secret : settings.secret,
			store : sessionStore,
			key: express.sid,
			clear_interval: 3600,
			cookie: {
		        maxAge: 600000 // 1 min as example
		    }
		}));
		app.use(express.methodOverride());
	});
	
	app.get('/', function (req, res) {
	    res.sendfile(__dirname + '/index.html');
	});
	
	app.configure('development', function(){
	  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
	
	app.configure('production', function(){
	  this.use(express.errorHandler());
	});
	
	io.configure('development', function(){
		  io.set('transports', ['websocket']);
		});
	/**
	 * Authorization
	 */
	//SESSION AND COOKIE FOR SOCKET.IO
	
	io.set('authorization', function (data, accept) {
		// check if there's a cookie header
	    if (data.headers.cookie) {
	        // if there is, parse the cookie
	        data.cookie = express.cookieParser(data.headers.cookie, settings.secret);
	        // note that you will need to use the same key to grad the
	        // session id, as you specified in the Express setup.
	        data.sessionID = data.cookie['express.sid'];
	        console.log(data.sessionID);
	    } else {
	       // if there isn't, turn down the connection with a message
	       // and leave the function.
	       return accept('No cookie transmitted.', false);
	    }
	    // accept the incoming connection
	    accept(null, true);
		});
	server.listen(port, function () {
		 util.log('############################################');
	     util.log(' Server started successfully on '+ port + '!');
	     util.log('############################################');
	});
	
	
	setEventHandlers();
}

init();
