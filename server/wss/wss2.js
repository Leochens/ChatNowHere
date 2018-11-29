var conn = require('../dbconnect');


/**
 * 根据uid删除user_connect表中的socket连接
 * @param {mix} socket 套接字
 * @param {object} data 包含uid的数据
 */
function handleFreeSocket(socket, uid) {


    const sql = `
        delete from connect_user
        where uid = '${uid}'
    `;
    function callback(error) {
        if (error) {
            socket.emit('err');
            console.log('free socket err');
        } else {
            console.log('释放成功');
        }
    }
    conn.query(sql, callback);

}

/**
 * 在连接表中为某一个用户分配并绑定一个socket连接
 * @param {mix} socket 套接字
 * @param {object} data 插入user_connect表的必要字段
 */
function handleApplySocket(socket, data) {
    const { uid, socket_id, ip ,username} = data;

    const sql =
        `
        INSERT INTO connect_user(
            uid,
            ip,
            socket_id,
            username
            ) 
        VALUES(
            '${uid}',
            '${ip}',
            '${socket_id}',
            '${username}'
        );
        `;
    function callback(error, result, fileds) {
        if (error) {
            // console.log(error);

            let msg = "分配socket出现错误";
            if (error.errno === 1062)
                msg = "该用户已经分配到了socket,不能重复分配";
            socket.emit('apply_socket_err', msg);
        }
        else {
            const msg = {
                msg: '分配socket成功',
                socket_id: socket.id
            };
            socket.emit('apply_socket_suc', msg)
        }
    }
    conn.query(sql, callback);
}

/**
 * 返回用户是否已经拥有连接 拥有返回该条 没有返回false
 * @param {int} uid 用户id
 */
function isUserHasConnection(filed,value) {
    return new Promise((resolve, reject) => {
        const sql = `select * from connect_user where ${filed} = '${value}'`;
        const callback = (err, result) => {
            if (err) {
                // console.log('isUserHasConnection|sql query err');
                reject(err);
            } else {

                if (result.length)
                    resolve(result[0]);
                else
                    resolve(false);
            }
        }
        conn.query(sql, callback);
    })
}






/**
 * 当客户端发起wss连接时的操作
 * @param {mix} socket 套接字
 */
function onConnectSuc(io,socket) {

    console.log('connect suc ');

    socket.on('join', function (data) {
        console.log(data);
        socket.uid = data.uid;  // 存下来
        socket.username = data.username;
        isUserHasConnection('uid',socket.uid)
            .then(flag => {
                // 如果当前用户已经存在连接 就释放old连接 重新申请
                if (flag) handleFreeSocket(socket, socket.uid);

                handleApplySocket(socket, {
                    uid: data.uid,
                    ip: socket.handshake.address,
                    socket_id: socket.id,
                    username: data.username
                });

            })
            .catch(err => {
                console.log(err);
            })
    });


    socket.on('sayTo',function (data){
        const { toName } = data;
        const sockets = io.sockets.sockets;

        isUserHasConnection('username',toName)
        .then(res=>{
            const { socket_id } = res;
            try{
                sockets[socket_id].emit('update_msg',{
                    
                });
                // console.log(socket_id);
            }catch(e){
                console.log(toName+' 不在线。将此信息存入未发送消息表');
            }
        })
        .catch(err=>{
            console.log(err);
        })
    });


    socket.on('disconnect', function () {
        handleFreeSocket(socket, socket.uid);
    })
    socket.on('error', function (err) {
        console.log("连接出现错误", err);
    })

}

function onConnect(socket) {
    console.log(`${socket.handshake.address},connecting....`);
}
function wss(io) {

    io.on('connection', (socket)=>onConnectSuc(io,socket));
    io.on('connect', onConnect);

}

module.exports = wss;