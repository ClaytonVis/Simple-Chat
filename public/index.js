

var socket = io();

var crumb = document.cookie.split('=');
var usrname = crumb[1];
var usrlist;
var mssglist;


socket.on('init', function(usrs, mssgs){
    console.log("What I get: " + mssgs);
    console.log("The length: " + mssgs.length);
    usrlist = usrs;
    mssglist = mssgs;
    refreshMsg();
    refreshUsr();
});

socket.on('new message', function(msg){
    var dt = new Date(msg.dt);
    date = dt.toLocaleTimeString();
    addMssg(date, msg.usr, msg.mess);
});

socket.on('verified name', function(name, users){
    usrname = name;
    document.cookie = "name=" + name +  " ; max-age=7200";
    usrlist = users;
    refreshUsr();
    $('#name').text(usrname);
});

socket.on('updated users', function(users){
    usrlist = users;
    refreshUsr();
});

socket.on('denied', function(name){
    err("The name, " + name + " is already taken.");
});

$(function(){
    $('form').submit(function(){
        var cont = $('#m').val();
        if (cont == undefined || cont == null || cont.length == 0) {
            $('#m').val('');
            return false;
        }
        var contlist = cont.split(' ');
        if (contlist[0] == '/nick'){
            contlist.shift();
            contlist = contlist.join(' ');
            if (contlist.length >= 32) {
                err("Names must be less than 32 characters in length.");
            } else {
                socket.emit('new name', contlist, usrname);
            }
        } else if (contlist[0] == '/rgb') {
          console.log('nothing yet');  
            
        } else {
          msg = {
              dt : new Date(),
              usr: usrname,
              mess: cont
          }
          socket.emit('submit message', msg);
        }
        $('#m').val('');
        return false;
    });
});

function refreshUsr(){
    $('#userList').empty();
    for (user in usrlist) {
        if (usrlist[user] == 'online'){
            $('#userList').append('<li class="online">' + user + '</li>');
        } else {
            var time = (new Date()).getTime();
            var theirs = new Date();
            theirs = usrlist[user];
            time = Math.floor((time - theirs)/60000);
            var tstr;
            if (time < 1){
                tstr = "<1 min";
            } else {
                tstr = time + " min";
            }
            $('#userList').append('<li class="offline">' + user + "<span class='time'>" + tstr +  '</span></li>');
        }
    }
}

function refreshMsg(){
    $('#messages').empty();
    var now = new Date();
    var date, auth, msg;
    for (i = 0; i < mssglist.length; i++) {
        var dt = new Date(mssglist[i].dt);
        if (dt.getFullYear() < now.getFullYear() || dt.getMonth() < now.getMonth() || dt.getDate() < now.getDate()) {
            date = dt.toUTCString();
        } else {
            date = dt.toLocaleTimeString();
        }
        auth = mssglist[i].usr;
        msg = mssglist[i].mess;
        addMssg(date, auth, msg);
    }
}

function err(msg){
    var now = new Date();
    addMssg(now.toLocaleTimeString(), "System", msg);
}
        
function addMssg(date, auth, msg){
    var wrapclass = '<li>'
    if (auth == "System") {
        wrapclass = '<li class="sysMsg">';
    }

    var authclass = '"auth">';
    if (usrname == auth) {
        authclass = '"auth self">';
    }
    $('#messages').prepend(wrapclass + '<span class="date">' + date + '</span><span class=' + authclass + auth + ':</span><span class="mssg">' + msg + '</span></li>');
}


