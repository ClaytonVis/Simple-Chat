const port = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser')
var favicon = require('serve-favicon');
var path = require('path');
var cookie = require('cookie');


let usrcount = 0;
let userslist = {};
const date = new Date();
let messagequeue = [((date.getTime()) +  " System Welcome to the simple chatter. Say something.")];
let msgCount = 0;

app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());

app.get('/', function(req, res){
    if (!req.cookies["name"]) {
        usrcount ++;
        res.cookie("name", "User" + usrcount);
    }
    res.render('home', {
        users: userslist,
    });
});


io.on('connection', function(socket){
    usrcook = cookie.parse(socket.request.headers.cookie || socket.handshake.headers.cookie);
    if (usrcook["name"]) {
        usrname = usrcook["name"];
        if (userslist[usrname] == "online") {
            usrcount ++;
            usrname = "User" + usrcount;
            socket.emit('new name', usrname);
        }
    } else {
        usrcount ++;
        usrname = "User" + usrcount;
        socket.emit('new name', usrname);
    }

    socket.emit('init messages', messagequeue);
    console.log(usrname + ' has connected');
    userslist[usrname] = "online";
    io.emit('update users', userslist);


    socket.on('disconnect', function(){
        console.log(usrname + ' has disconnected');
        userslist[usrname] = "offline";
        io.emit('update users', userslist);
    });


    socket.on('submit message', function(msg){
        if (msg.split(' ')[0] == '/nick') {
            var newname = msg.slice(6);
            if (newname.length >= 16) {
                console.log('name too long');
            } else if (userslist[newname] == "true") {
                socket.emit('name taken', newname);
                console.log(usrname + ": name taken, " + newname);
            } else {
                console.log(newname);
                delete userslist[usrname];
                userslist[newname] = "online";
                usrname = newname;
                socket.emit('new name', newname);
                io.emit('update users', userslist);
            }
        } else {
            messagequeue.push(msg);
            msgCount ++;
            io.emit('recieve message', msg);
            if (msgCount >= 200) {
                messagequeue.shift();
                msgCount --;
            }
        }
    });
});


http.listen(port, function(){
    console.log('listening on ', port);
});

