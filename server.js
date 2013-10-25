/**
 * The server of the game
 * @author Benjamin François
 */
/**
 * Settings
 */
var settings = require("./settings/settings").settings;

/*******************
 * Game Requirements
 ******************/
Player = require("./server-classes/player/Player").Player;

/***********************
 ** Node.js Requirements
 ***********************/
var path = require("path"),
express = require("express"),

// Express server
app = express(),
io = require('socket.io'),
util = require("util"),
http = require('http'),
connect = require('express/node_modules/connect'),
cookie = require('express/node_modules/cookie'),

// MongoDB
mongoUrl = 'mongodb://'+ settings.host
+':'+ settings.db_port.toString()
+ '/' + settings.db,
mongoStore = require('connect-mongo')(express),
mongoose = require("mongoose"),
mongooseConnection,
server,
sockets,
sessionStore;

/******************
 ** Game variables
 *****************/
var players = [];

/********************
 ** Databases Schemas
 *******************/
var PLAYER_SCHEMA = require("./settings/schemas/schemas").PLAYER_SCHEMA;
var ACCOUNT_SCHEMA = require("./settings/schemas/schemas").ACCOUNT_SCHEMA;
var AccountSchema;
var PlayerSchema;

/*******************
 ** Databases Models
 *******************/
var accountModel;
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
//Active sockets by session
function onSocketConnection(client){
	// Listen for client authentification
	client.on("authentification", onAuthAccount);
	
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

/************************
 ** Server initialization
 ************************/
function init(){

	/*************************
	 ** Database configuration
	 *************************/
	mongooseConnection = mongoose.connect(mongoUrl, function(err){
		if(err){ throw err;}
		else {
			
		}
	});
	
	// The data for the player in the database
	PlayerSchema = new mongoose.Schema(PLAYER_SCHEMA);
	
	AccountSchema = new mongoose.Schema(ACCOUNT_SCHEMA);

	// The account model
	accountModel = mongoose.model('accounts', AccountSchema);
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
				  util.log('Administrator account added !');
				});
			
		  }
		  return;
	});
	
	// The player model for the data
	playerModel = mongoose.model('players', PlayerSchema);
	
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
	
	// Store sessions in the database
	sessionStore = new mongoStore({url: mongoUrl},function(){
		util.log("Connected to the database");
	});
	
	/***********************
	 ** Server configuration
	 ***********************/
	app.configure(function(){
		app.use(express.bodyParser());
		app.use(express.cookieParser(settings.secret));
		
		// Session Management
		app.use(express.session({
			secret: settings.secret, // Our secret used in order to decode the session
			key: "express.sid",
			store: sessionStore,
			cookie: {
				httpOnly: true,
				maxAge: 600000 // TTL of the cookie
			}
		}));
		
		app.set("log level" , 2);
		app.set("port", settings.port);
		// Client directory
		app.use(express.static(__dirname + '/public'));
		app.use(app.router);
		// Client page
		app.get('/', function(req, res) {
				res.sendfile(__dirname + '/index.html');
		})
		// Registration page
		.get('/register', function(req, res) {
				res.sendfile(__dirname + '/public/register.html');
		});
		// Add a new account to the database
		app.post('/addaccount', function(req, res){
			util.log("New account created : " + req.body.login);
		});
		
		// Check if the client is authentified
		app.post('/connexion', function(req, res){
			console.log("Checking authentification for : " + req.body.login);
			// Check if the account exist
			var query = accountModel.find(null);
			query.where('login').equals(req.body.login);
			query.where('password').equals(req.body.password);

			query.exec(function (err, accounts) {
				if (err) {
					res.send({signIn: false});
					throw err; 
				}
			res.send({signIn: true});
			});
			
		});
		
	});
	
	
	
	app.configure('development', function(){
		this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
	
	app.configure('production', function(){
	  this.use(express.errorHandler());
	});
	
	/***************
	 * Authorization
	 ***************/
	server = http.createServer(app).listen(app.get('port'), function(){
		util.log('######################################################');
	    util.log(' JS-MMORPG Server started successfully on '+ app.get('port') + '!');
	    util.log('######################################################');
	});
	
	io = io.listen(server);
	io.set("log level", 2);
	io.set('authorization', function (handshakeData, accept) {
		  if (handshakeData.headers.cookie) {
			  handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

			    handshakeData.sessionID = connect.utils.parseSignedCookies(handshakeData.cookie, settings.secret);
			    sessionStore.get(handshakeData.sessionID, function(err, session) {
			        if (err || !session) {
			          accept(err || "No Session founded", false);
			        } else {
			        	 handshakeData.session = session;
			          accept(null, true);
			        }
			      });
		  } else {
		    return accept('No cookie transmitted.', false);
		  } 

		  accept(null, true);
	});
	setEventHandlers();
}

init();
