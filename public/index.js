var socket = io();

var crumb = document.cookie.split('=');
var usrname = crumb[1];
var usrlist;
var mssglist;

$('#name').text(usrname);



socket.on('init', function(usrs, mssgs){
    usrlist = usrs;
    mssglist = mssgs;
    refreshMsg();
//    refreshUsr();
});

socket.on('new message', function(msg){
    var dt = new Date(msg.dt);
    date = dt.toLocaleTimeString();
    addMssg(date, msg.usr, msg.mess);
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


function tellme(){
    alert("me");
}
