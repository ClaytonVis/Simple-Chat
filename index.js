const port = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var fs = require('fs');

app.set('views', (__dirname, 'public'));
app.set('view engine', 'jade');
app.use(cookieParser());

var usrcount = 0;

var userFile = require('./logs/users.json');
var messageFile = require("./logs/messages.json");
var users = userFile['users'];
var mssgs = messageFile['messages'];
console.log('users: ', users);
console.log('messages: ', mssgs);

var date = new Date();
userFile["/"] = date;
messageFile['/'] = date;
fs.writeFileSync('./logs/users.json', (JSON.stringify(userFile)), 'utf8');
fs.writeFileSync('./logs/messages.json', (JSON.stringify(messageFile)), 'utf8');


app.get('/', function(req, res){
    if (!req.cookies["name"]){
        usrcount ++;      
        res.cookie("name", "User" + usrcount, {maxAge : 100000});
    }
    res.render('index');
});

io.on('connection', function(socket){
    console.log("A user has connected!");
    socket.emit('init', users, mssgs);

    //    socket.on('init name', function(reqData){
  //      console.log(reqData);
        //console.log("something happens: " + socket.handshake.headers);
   // });

    socket.on('submit message', function(incoming){
        mssgs.push(incoming);
        if (mssgs.length > 200) {
            mssgs.shift();
        }
        messageFile['messages'] = mssgs;
        fs.writeFileSync('./logs/messages.json', (JSON.stringify(messageFile)), 'utf8');
        io.emit('new message', incoming);
    });
});

http.listen(port,function(){
    console.log('listening on ', port);
});
