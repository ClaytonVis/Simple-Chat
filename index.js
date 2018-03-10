const port = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser')
var favicon = require('serve-favicon');
var path = require('path');
var cookie = require('cookie');


let counter = 0;
let userslist = {};
let messagelist = [];

app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
//app.use(favicon(path.join( __dirname, 'chaticon.ico')));

app.get('/', function(req, res){
    if (!req.cookies["name"]) {
        counter ++;
        res.cookie("name", "User" + counter);
    }
    res.render('home', {
        users: userslist,
        messages: messagelist
    });
 
});

io.on('connection', function(socket){
    usrcook = cookie.parse(socket.request.headers.cookie || socket.handshake.headers.cookie);
    if (usrcook["name"]) {
        usrname = usrcook["name"];
    } else {
        counter ++;
        usrname = "User" + counter;
    }

    console.log(usrname + ' has connected');
    userslist[usrname] = "online";

    socket.on('disconnect', function(){
        console.log(usrname + ' has disconnected');
        userslist[usrname] = "offline";
    });

    socket.on('chat message', function(msg){
        if (msg.split(' ')[0] == '/nick') {
            var newname = msg.slice(6);
            if (newname.length >= 16) {
                console.log('name too long');
            } else {
                console.log(newname);
                usrname = newname;
                socket.emit('new name', newname);
            }
        } else { 
            io.emit('chat message', msg);
        }
    });
});


http.listen(port, function(){
    console.log('listening on ', port);
});

