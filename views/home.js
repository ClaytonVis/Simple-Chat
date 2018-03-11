var socket = io();
var users;
var usrname;

function getName () {
    alert(usrname);
}

if (document.cookie) {
    var cookieList = document.cookie.split(';');
    usrname = cookieList[cookieList.indexOf('name=')];
} else {
    socket.emit('init name');
    
};


$(function () {
    $('form').submit(function() {
        console.log("Submit message: " + $('#m').val());
        var date = new Date();
        var time = date.getTime();
        var mssg = time + " " + usrname + " " + $('#m').val();
        socket.emit('submit message', mssg);
        $('#m').val('');
        return false;
    });

    socket.on('init messages', function(messages) {
        var cont;
        for (var i = 0; i < messages.length; i++) {
            cont = parseMssg(messages[i]);
            $('#messages').append(cont);
        }
        
    });

    socket.on('recieve message', function(msg) {
        console.log("Recieved message: " + msg);
        var cont = parseMssg(msg);
        if (cont) {
            $('#messages').append(cont);
        }
    });

    socket.on('new name', function(msg) {
        document.cookie = "name=" + msg;
        usrname = msg;
        $('#name').text(usrname);
    });

    socket.on('name taken', function(nw) {
        alert("name taken: " + nw);
    });

    socket.on('update users', function(list) {
        users = list;
        $('#userWell').empty();
        for (user in list) {
            $('#userWell').append('<li>' + user + '</li>');
        }
    });
});

function parseMssg(mssg) {
    var aclass;
    if (mssg.toString() !== 0) {
        var date = new Date();
        splMsg = mssg.split(' ');
        date.setTime(splMsg[0]);
        var auth = splMsg[1];
        var time = date.toLocaleTimeString();
        var msgTxt = mssg.slice(splMsg[0].length + splMsg[1].length + 2);
        if (auth == usrname) {
            aclass = '<span class="auth self"> ';
        } else {
            aclass = '<span class="auth"> ';
        }
        return ('<li><span class="time">' + time + ' </span>' + aclass + auth + ': </span><span class="mssg"> ' + msgTxt + ' </span></li>');
    } else {
        return false;
    }
}
