
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;
// var bodyParser = require('body-parser');

var wss = require('./wss');
var conn = require('./dbconnect');
// app.use(bodyParser.urlencoded({ entended: true }));
app.get('/', function (req, res) {
    console.log('http req');
    res.send('hello ， this is zhl\'s server ');
})

// conn.connect();


app.get('/userlogin/:username/:password', function (req, res) {
    console.log('接受到userlogin请求 | get');
    console.log(req.params);
    const { username, password } = req.params;
    conn.query(
        `SELECT * FROM users WHERE username = '${username}' and password = '${password}'`,
        function (error, results, fields) {
            if (error)
                throw error;
            if (results.length > 0) {
                console.log(username + ' 登录成功');
                return res.send(JSON.stringify({ res: 1, msg: '登陆成功' }));
            }else{
                return res.send({res: 0,msg: '登录失败'});
            }
        });

});

app.get('/userregist/:username/:password/:email', function (req, res) {
    console.log('接受到userregist请求 | get');
    console.log(req.params);
    const { username, password, email } = req.params;
    conn.query(
        `INSERT INTO users(username,password,email) VALUES('${username}','${password}','${email}');`,
        function (error, results, fields) {
            if (error){
                res.send('❌');
                throw error;
            }

            res.send({res:1,msg:'注册成功'});
        }
    )

});

app.post('/userlogin', function (req, res) {
    console.log(req.param('name'));
    console.log(req.body);
    res.send('hello get it | post');
});
wss(io);
http.listen(port, function () {
    console.log('server is listenning on port ' + port);
})


