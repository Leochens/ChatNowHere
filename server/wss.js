var conn = require('./dbconnect');

const packMsg = (msg, type, socketId) => { return { ...msg, type, socketId, curCnt } };
const MY_MSG = 1;
const OTHERS_MSG = 2;
const SYSTEM_MSG = 3;
let curCnt = 0;
const errMsg = packMsg({name:'系统',content:'出现错误'},SYSTEM_MSG,0);
conn.connect();


insertMsg = (msg,type) => {
    conn.query(
        `INSERT INTO message(username,time,type,content) VALUES ('${msg.name}','${msg.time}',${type},'${msg.content}')`,
    (error,res,fields)=>{
        if (error){
            socket.emit('update_msg', errMsg);
            throw error;
        }
    }
    );
}

getMsg = () => {
    let msgs = [];
    conn.query(
        `SELECT * FROM message LIMIT 20`,
        (error,res) => {
            msgs = res;
            console.log(msgs);
        }
    );
}
function wss(io){
    io.on('connection', function (socket) {
        console.log('connected: ' + socket.handshake.address + ' socketId=' + socket.id + ' curCnt:' + curCnt);
        socket.on('join', function (name) {
            const msg = {
                name: '系统',
                content: name + ' 加入了群聊',
                time: Date.toString()
            }
            curCnt++;
            insertMsg(msg,SYSTEM_MSG);
            socket.name = name;


            socket.emit('joinChat', packMsg(msg, SYSTEM_MSG, socket.id));
            socket.broadcast.emit('joinChat', packMsg(msg, SYSTEM_MSG, socket.id));
            console.log(socket.name + " id: " + socket.id + " 加入 | 当前在线:" + curCnt);
    
        });
        socket.on('send_msg', function (msg) {
            getMsg();
            socket.emit('update_msg', packMsg(msg, MY_MSG, socket.id));

            insertMsg(msg,OTHERS_MSG);
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
            insertMsg(msg,SYSTEM_MSG);
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
