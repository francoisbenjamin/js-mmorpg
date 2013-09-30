/**
 * Main file
 * @author Benjamin François 
 */
var socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

$(document).ready(function(){
    var view = new View(new Model(),'#000000', true);
    new Controller(view, view.getModel());
    socket.on("connect", onSocketConnected);
});

function onSocketConnected() {
	console.log("Connected to socket server");
};