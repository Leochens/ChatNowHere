
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;
const MY_MSG = 1;
const OTHERS_MSG = 2;
const SYSTEM_MSG = 3;
let curCnt = 0;
app.get('/', function (req, res) {
    res.send('hello zhl');
})
const packMsg = (msg, type, socketId) => { return { ...msg, type, socketId,curCnt } };

io.on('connection', function (socket) {
    curCnt++;
    console.log('connected: ' + socket.handshake.address + ' socketId=' + socket.id+' curCnt:'+curCnt);
    socket.on('join', function (name) {
        const msg = {
            name: '系统',
            content: name + ' 加入了群聊'
        }
        socket.emit('joinChat', packMsg(msg, SYSTEM_MSG, socket.id));
        socket.broadcast.emit('joinChat', packMsg(msg, SYSTEM_MSG, socket.id));
    });
    socket.on('send_msg', function (msg) {
        socket.emit('update_msg', packMsg(msg, MY_MSG, socket.id));
        socket.broadcast.emit('update_msg_broadcast', packMsg(msg, OTHERS_MSG, socket.id));
    });
    socket.on('bye',function(name){
        const msg = {
            name: '系统',
            content: name + " 离开了群聊"
        }
        // socket.emit('offline',packMsg(msg,SYSTEM_MSG,socket.id));
        socket.broadcast.emit('offline',packMsg(msg,SYSTEM_MSG,socket.id));
    });
    socket.on('disconnect', function (data) {
        curCnt--;
        console.log(socket.id + "离线",data,"curCnt:"+curCnt);
    })
});

io.on('connect', () => {
    console.log('connected!');
});
http.listen(port, function () {
    console.log('server is listenning on port ' + port);
})


