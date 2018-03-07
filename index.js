const port = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
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

var date = new Date();
userFile["/"] = date;
messageFile['/'] = date;
fs.writeFileSync('./logs/users.json', (JSON.stringify(userFile)), 'utf8');
fs.writeFileSync('./logs/messages.json', (JSON.stringify(messageFile)), 'utf8');

function addUser(name){
    users[name] = 'online'
    userFile['users'] = users;
    fs.writeFileSync('./logs/users.json', (JSON.stringify(userFile)), 'utf8');
}

function rmvUser(name){
    var date = new Date();
    users[usrname] = date.getTime();
    userFile['users'] = users;
    fs.writeFileSync('./logs/users.json', (JSON.stringify(userFile)), 'utf8');
}

function initName();
    usrcount ++;
    return ("User" ++ usrcount);
}

app.get('/', function(req, res){
    if (!req.cookies["name"]){
        res.cookie("name", initName(), {maxAge : 100000});
    } else {
        res.cookie('name', req.cookies['name'], {maxAge: 10000});
    }
    res.render('index');
});

io.on('connection', function(socket){
    var theCookies = cookie.parse(socket.request.headers.cookie || socket.handshake.headers.cookie);
    if (theCookies['name']){
        var usrname = theCookies['name'];
    } else {
        var usrname = initName();
    }
    addUser(usrname);
    socket.emit('verified name', usrname);

       
    socket.emit('init', users, mssgs);

    socket.on('disconnect', function(){
        console.log("A user has disconnected..");
        rmvUser(usrname);
        io.emit('update users', users);
    });

    socket.on('submit message', function(incoming){
        mssgs.push(incoming);
        if (mssgs.length > 200) {
            mssgs.shift();
        }
        messageFile['messages'] = mssgs;
        fs.writeFileSync('./logs/messages.json', (JSON.stringify(messageFile)), 'utf8');
        io.emit('new message', incoming);
    });

    socket.on('new name', function(newname, oldname){
        console.log("Person: " + oldname + " has requested to change their name to: " + newname);
        if (users[name] == 'online') {
            socket.emit('denied');
            console.log('\tDenied');
        } else {
            console.log('\tGranted');
            users[name] == 'online';
            userFile['users'] = users;
            io.emit('update users', users);
            fs.writeFileSync('./logs/users.json', (JSON.stringify(userFile)), 'utf8');
        }
    });

});

http.listen(port,function(){
    console.log('listening on ', port);
});
