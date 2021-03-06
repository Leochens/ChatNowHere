const { time, packMsg } = require('./untils');
const { MY_MSG, OTHERS_MSG, SYSTEM_MSG, MSG_LIST } = require('./constants');
const _ = require('lodash');
const conn = require('./dbconnect');
let curCnt = 0;
const hashName = new Array();
insertMsg = (msg, type) => {

    if (msg.content === '')
        return;
    conn.query(
        `INSERT INTO message(name,time,type,content) VALUES ('${msg.name}','${msg.time}',${type},'${msg.content}')`,
        (error, res, fields) => {
            if (error) {
                throw error;
            }
        }
    );
}


function wss(io) {
    io.on('connection', function (socket) {
        console.log('connected: ' + socket.handshake.address + ' socketId=' + socket.id + ' curCnt:' + curCnt);
        socket.on('join', function (name) {
            const msg = {
                name: '系统',
                content: name + ' 加入了群聊',
                time: time()
            }
            curCnt++;
            hashName.push(name);
            insertMsg(msg, SYSTEM_MSG);
            conn.query(
                `SELECT * FROM message ORDER BY id DESC LIMIT 20`,
                (error, msgs) => {
                    if (error) {
                        msgs = [];
                    }
                    msgs.reverse();
                    socket.emit('joinChat', { msgs, type: MSG_LIST });
                    socket.broadcast.emit('joinChat', packMsg(msg, SYSTEM_MSG, socket.id, curCnt));
                    socket.name = name;
                    console.log(`${socket.name} id: ${socket.id} 加入 | 时间: ${msg.time}  | 当前在线: ${curCnt}`);
                }
            );

        });
        socket.on('send_msg', function (msg) {
            socket.emit('update_msg', packMsg(msg, MY_MSG, socket.id, curCnt));
            insertMsg(msg, OTHERS_MSG);
            // 如果列表中没有该成员 则添加
            if(!hashName.includes(msg.name))
                hashName.push(msg.name);

            console.log(`${socket.name} id: ${socket.id} 发送:  ${msg.content} | 当前在线: ${curCnt}`);
            socket.broadcast.emit('update_msg_broadcast', packMsg(msg, OTHERS_MSG, socket.id, curCnt));
        });
        socket.on('disconnect', function (data) {
            const msg = {
                name: '系统',
                content: socket.name + " 离开了群聊",
                time: time()
            }
            socket.broadcast.emit('offline', packMsg(msg, SYSTEM_MSG, socket.id, curCnt));
            socket.emit('update_msg', packMsg(msg, SYSTEM_MSG, socket.id, curCnt));
            insertMsg(msg, SYSTEM_MSG);

            // 连接断开时从表中删除该用户
            hashName.splice(hashName.indexOf(socket.name), 1);


            console.log(socket.name + " id: " + socket.id + " 连接断开 当前在线:" + curCnt);
            curCnt--;
        });

        socket.on('sayTo', function (data) {
            const toName = data.toName;
            let toSocket = 0;
            const sockets = io.sockets.sockets;
            for (const index in sockets) {
                // console.log(index);
                if (sockets[index].name = toName) {
                    console.log('===========');
                    console.log(sockets[index].name,socket.name);
                    toSocket = sockets[index];
                    console.log('===========');
                    break;
                }
            }
            toSocket.emit('update_msg', data.msg);
        });

        socket.on('getOnlineUsers',function(data,callback){
            callback(hashName);
        });
    });

    io.on('connect', () => {
        console.log('connecting...!');
    });
}
module.exports = wss;
