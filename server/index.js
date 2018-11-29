
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;
var wss = require('./wss2');
var conn = require('./dbconnect');
var indexRoute = require('./routes/index');
var dbTestRoute = require('./routes/dbTest');
conn.connect();

app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
}); 

app.use('/socket_test',indexRoute);
app.use('/dbtest',dbTestRoute);
app.get('/',function(req,res){
    res.send('hello Main /');
})



wss(io);
http.listen(port, function () {
    console.log('server is listenning on port ' + port);
})


