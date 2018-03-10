const port = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser')
var favicon = require('serve-favicon');
var path = require('path');

let counter = 0;

app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(favicon(path.join( __dirname, 'chaticon.ico')));

app.get('/', function(req, res){
    res.cookie("name", "Test Name");
    res.render('home', {
        title: 'Jade Test'
    });
});

io.on('connection', function(socket){
    counter += 1;
    console.log('User: has connected');
    

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

