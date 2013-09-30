
$(document).ready(function(){
    var view = new View(new Model(),'#000000', true);
    new Controller(view, view.geModel());
});

var socket = io.connect(window.location.hostname);

socket.on('status', function (data) {
    $('#status').html(data.status);
});

$('#reset').click(function() {
    socket.emit('reset');
});