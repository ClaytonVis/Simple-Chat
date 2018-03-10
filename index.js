const port = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');

var usrcount = 0;

app.set('views', (__dirname, 'public'));
app.set('view engine', 'pug');
app.use(cookieParser());

app.get('/', function(req, res){
    if (!req.cookies["name"]) {
        usrcount ++;
        res.cookie("name", "User" + usrcount);
    }

    res.render('index');
});


http.listen(port, function(){
    console.log('listening on ', port);
});
