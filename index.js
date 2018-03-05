const port = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser')

app.use(cookieParser());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
//    if (req.cookies["name"]) {
//        res.send(req.cookies["name"]);
//    } else {
//        res.cookie("name", "testor");
//        res.send("Welcome for the first time, " + req.cookies["name"]);
//    }
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});


http.listen(port, function(){
    console.log('listening on ', port);
});

