const packMsg = (msg, type, socketId) => { return { ...msg, type, socketId, curCnt } };
const MY_MSG = 1;
const OTHERS_MSG = 2;
const SYSTEM_MSG = 3;
let curCnt = 0;
function wss(io){
    io.on('connection', function (socket) {
        console.log('connected: ' + socket.handshake.address + ' socketId=' + socket.id + ' curCnt:' + curCnt);
        socket.on('join', function (name) {
            const msg = {
                name: '系统',
                content: name + ' 加入了群聊'
            }
            curCnt++;
    
            socket.name = name; //直接在当前socket上设置名字 妙啊
            socket.emit('joinChat', packMsg(msg, SYSTEM_MSG, socket.id));
            socket.broadcast.emit('joinChat', packMsg(msg, SYSTEM_MSG, socket.id));
            console.log(socket.name + " id: " + socket.id + " 加入 | 当前在线:" + curCnt);
    
        });
        socket.on('send_msg', function (msg) {
            socket.emit('update_msg', packMsg(msg, MY_MSG, socket.id));
            // socket.emit('test',socket.client);
            console.log(socket.name + " id: " + socket.id + " 发送: " + msg.content, " | 当前在线:" + curCnt);
            socket.broadcast.emit('update_msg_broadcast', packMsg(msg, OTHERS_MSG, socket.id));
        });
        socket.on('disconnecting', function () {
            const msg = {
                name: '系统',
                content: socket.name + " 离开了群聊"
            }
            console.log(socket.name + " id: " + socket.id + " error断开 ")
    
        });
        socket.on('exit', function () {
            const msg = {
                name: '系统',
                content: socket.name + " 离开了群聊"
            }
            socket.broadcast.emit('offline', packMsg(msg, SYSTEM_MSG, socket.id));
            socket.emit('update_msg', packMsg(msg, SYSTEM_MSG, socket.id));
            socket.disconnect();
            console.log(socket.name + " id: " + socket.id + "exit ", " | 当前在线:" + curCnt);
        })
        socket.on('disconnect', function (data) {
            console.log(socket.name + " id: " + socket.id + " 连接断开 ")
            curCnt--;
        })
    });
    
    io.on('connect', () => {
        console.log('connecting...!');
    });
}
module.exports = wss;
