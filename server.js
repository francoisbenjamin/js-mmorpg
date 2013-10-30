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
var sessionIDs = new Array();
/********************
 ** Databases Schemas
 *******************/
var AccountSchema = require("./settings/schemas/schemas").AccountSchema;
var PlayerSchema = require("./settings/schemas/schemas").PlayerSchema;

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
 * @returns {Array}
 */
function onAuthAccount(client, callback) {
	util.log("An attempt of connection of the account : " + client.login.toLowerCase());
	var query = accountModel.find(null);
	query.where('login', client.login.toLowerCase());
	query.exec(function (err, account) {
		if (err) {
			callback({characters: null});
			throw err;
		}
		//Return the client's characters' list
		callback({characters: account[0].characters});
	});
}

function onSocketConnection(client){
	var sessionID = client.handshake.sessionID; // Store session ID from handshake
	  // this is required if we want to access this data when user leaves, as handshake is
	  // not available in "disconnect" event.
	// Listen for client authentification
 if(sessionIDs.indexOf(client.handshake.login) > -1) {
	  util.log("Session already in use " + connect.utils.parseSignedCookie(client.handshake.login,settings.secret));
	  io.sockets.socket(client.id).emit('preventLogin', true);
 }
 else {
	  sessionIDs.push(client.handshake.login);
 }
	client.on("authentication", onAuthAccount);
	
	// Listen for client disconnected
	client.on("disconnect", function(){
		 // Is this socket associated to user session ?
		var ind = sessionIDs.indexOf(sessionID);
		sessionIDs.splice(ind, 1);
		
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
	});
	
	// Listen for move player message
	client.on("move player", onMovePlayer);
	
	// Listen for new player message
	client.on("new player", onNewPlayer);
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
	});
	
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
		})
		// Administrator page
		.get('/admin', function(req, res) {
			res.sendfile(__dirname + '/public/admin.html');
		});
		
		// Administrator page
		app.post('/success', function(req, res) {
			res.sendfile(__dirname + '/public/success.html');
		});
		// Add a new account to the database
		app.post('/createcharacter', function(req, res){
			var query = accountModel.find(null);
			query.where('characters.name', req.body.characterName.toLowerCase());
			query.exec(function (err, player) {
				if (err) {
					throw err;
				}
				// If the character don't exist already
				if(!player[0]){
					// TODO Get the old character array and add the new character
					var newCharacter = {
							name:  req.body.characterName.toLowerCase(),
							level: 1,
							spawn_x : 50,
							spawn_y : 40,
							x : 50,
							y : 40,
							exp : 0
					};
					accountModel.update({ login : req.body.login.toLowerCase()}, { characters : newCharacter }, { multi : true }, function (err) {
						  if (err) { throw err; }
						  console.log(req.body.login.toLowerCase() + ' added a new  character : ' + req.body.characterName.toLowerCase());
						  res.send({done: true});
					});
				}
				else {
					res.send({done: false});
				}
			});
		});
		
		// Check if the account exist
		app.post('/createaccount', function(req, res){
			var query = accountModel.find(null);
			query.where('login', req.body.login.toLowerCase());
			query.exec(function (err, account) {
				if (err) {
					throw err;
				}
				// If the character don't exist already
				if(!account[0]){
					var newAccount = new accountModel();
					newAccount.login = req.body.login.toLowerCase();
					newAccount.password = req.body.password;
					newAccount.email = req.body.email;
					newAccount.last_log =  Date.now();
					newAccount.save(function (err) {
						  if (err) { throw err; }
						  util.log('New account created : ' + req.body.login.toLowerCase() + '!');
						  res.send({done: true});
					});
				}
				else {
					res.send({done: false});
				}
			});
		});
		
		// Check if the client is authentified
		app.post('/connexion', function(req, res){
			util.log("Checking authentification for : " + req.body.login);
			// Check if the account exist
			var query = accountModel.find(null);
			query.where('login').equals(req.body.login);
			query.where('password').equals(req.body.password);

			query.exec(function (err, accounts) {
				if (err) {
					res.send({valid: false});
					throw err; 
				}
				res.cookie("login", req.body.login, {signed: true});
				res.send({valid: true});
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
	io.set('authorization', function (handshakeData, callback) {
		  // Read cookies from handshake headers
		  var cookies = cookie.parse(handshakeData.headers.cookie);
		  // We're now able to retrieve session ID
		  var sessionID;
		  if (cookies['express.sid']) {
		    sessionID = connect.utils.parseSignedCookie(cookies['express.sid'], settings.secret);
		  }
		  // No session? Refuse connection
		  if (!sessionID) {
		    callback('No session', false);
		  } else {
		    // Store session ID in handshake data, we'll use it later to associate
		    // session with open sockets
		    // On récupère la session utilisateur, et on en extrait son username
		    sessionStore.get(sessionID, function (err, session) {
		      if (!err && session && cookies.login) {
		        // On stocke ce username dans les données de l'authentification, pour réutilisation directe plus tard
		        handshakeData.login = cookies.login;
		        // OK, on accepte la connexion
		        callback(null, true);
		      } else {
		        // Session incomplète, ou non trouvée
		        callback(err || 'User not authenticated', false);
		      }
		    });
		  }
		});
	setEventHandlers();
}

init();
