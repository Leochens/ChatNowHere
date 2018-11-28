
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;
var conn = require('./dbconnect');
var wss = require('./wss');
var conn = require('./dbconnect');
var indexRoute = require('./routes/index');
var dbTestRoute = require('./routes/dbTest');
conn.connect();

app.get('/',function(req,res){
    res.send('hello Main /');
})



app.use('/socket_test',indexRoute);

app.use('/dbtest',dbTestRoute);
// wss(io);
http.listen(port, function () {
    console.log('server is listenning on port ' + port);
})


