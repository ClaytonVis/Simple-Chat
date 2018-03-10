var socket = io();
if (document.cookie) {
    var cookieList = document.cookie.split(';');
    var usrname = cookieList[cookieList.indexOf('name=')];
} else {
    socket.emit('init name');
    
};

function alertMe() {
    alert("this works bro\n" + document.cookie);
}

$(function () {
    $('form').submit(function() {
        console.log("test message");
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('messages').append($('<li>').text(msg));
    });

    socket.on('new name', function(msg) {
        document.cookie = "name=" + msg;
        $('#name').text(msg);
    });

});
