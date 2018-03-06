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
        msg = {
            dt : new Date(),
            usr: usrname,
            mess: $('#m').val()
        }
        socket.emit('submit message', msg);
        console.log(msg);
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
        
function addMssg(date, auth, msg){
    $('#messages').prepend('<li><span class="date">' + date + '</span><span class="auth">' + auth + '</span><span class="mssg">' + msg + '</span></li>');
}


function tellme(){
    alert("me");
}
