/**
 * The server of the application
 */

// Imports modules
var express = require('express'),
app = express(),
http = require('http'),
server = http.createServer(app),
io = require('socket.io').listen(server);

// listen for new web clients:
server.listen(8080);

var routes = require('./routes');

// Configuration of the application
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.set('port', process.env.PORT || 5000);
	app.use(express.static(__dirname + '/public'));
});

// Routes
app.get('/', routes.index);
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// Development version : allow debug
app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

// Production version
app.configure('production', function() {
	app.use(express.errorHandler());
});
