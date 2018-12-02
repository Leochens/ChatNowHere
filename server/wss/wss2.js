var conn = require('../dbconnect');
const time = require('../untils/').time;
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
    const { uid, socket_id, ip, username } = data;

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
function isUserHasConnection(filed, value) {
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
                    resolve(false);//对方不在线
            }
        }
        conn.query(sql, callback);
    })
}
/**
 * 在数据里存储message 发送成功status为1 发送成功接受成功status为2
 * @param {object} msg 消息体
 */
function handleSaveMessage(msg) {
    const sql = `INSERT INTO message(
        from_id,
        to_id,
        from_name,
        to_name,
        content,
        type,
        create_time,
        msg_status,
        flag
    ) VALUES(
        '${msg.from_id}',
        '${msg.to_id}',
        '${msg.from_name}',
        '${msg.to_name}',
        '${msg.content}',
        '${msg.type}',
        '${msg.create_time}',
        '${msg.msg_status}',
        '${msg.flag}'
    );`;

    return new Promise((resolve, reject) => {

        const callback = (err, result) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        }
        conn.query(sql, callback);
    })
}


/**
 * 查看uid用户因离线未收到的消息
 * @param {int} uid 用户id
 */
function handlePeekUnReceivedMessage(uid) {
    const sql = `SELECT * FROM message WHERE to_id = ${uid} and  msg_status = 1`;
    return new Promise((resolve, reject) => {
        const callback = (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        };
        conn.query(sql, callback);
    })
}

/**
 * 置ids列表的message的msg_status为2 置为已接收
 * @param {array} ids id组成的数组
 */
function setMessageReceived(ids) {

    const sql = `UPDATE message 
    set msg_status = 2 
    WHERE mid in (${ids.join()})`;
    return new Promise((resolve, reject) => {
        if (Array.isArray(ids) && ids.length === 0) {
            resolve([]);
        }
        console.log(ids);
        const callback = (err, result) => {
            if (err)
                return reject(err);
            return resolve(result);
        }
        conn.query(sql, callback);
    })
}
/**
 * 按照某一字段查找用户表 返回结果的第一个 用户信息
 * @param {any} filed 查询字段
 * @param {any} value 字段查询置
 */
function handleGetUserDetails(filed,value) {
    const sql = `SELECT * FROM users WHERE ${filed} = '${value}'`;
    return new Promise((resolve, reject) => {
        const callback = (err, result) => {
            if (err)
                return reject(err);
            resolve(result[0]);
        }
        conn.query(sql, callback);
    })
}

/**
 * 当客户端发起wss连接时的操作
 * @param {mix} socket 套接字
 */
function onConnectSuc(io, socket) {

    console.log('connect suc ');
    // 用户登录
    /**
     * data = {username,uid}
     */
    socket.on('join', function (data) {
        console.log(data);
        socket.uid = data.uid;  // 存下来
        socket.username = data.username;
        isUserHasConnection('uid', socket.uid)
            .then(flag => {
                // 如果当前用户已经存在连接 就释放old连接 重新申请
                if (flag) handleFreeSocket(socket, socket.uid);
                handlePeekUnReceivedMessage(socket.uid).then(msgList => {
                    if (Array.isArray(msgList) && msgList.length > 0)
                        socket.emit('fetch_receive_msg', msgList, function () {
                            setMessageReceived(msgList.map((item) => item.mid));
                        });
                });
                handleApplySocket(socket, {
                    uid: socket.uid,
                    ip: socket.handshake.address,
                    socket_id: socket.id,
                    username: socket.username
                });
            })
            .catch(err => {
                console.log(err);
            })
    });

    // 监听私聊事件
    /**
     * data = { toName,content,toId}
     */
    socket.on('sayTo', function (data) {
        const { toName, content,toId } = data;
        const sockets = io.sockets.sockets;
        console.log("当前用户", socket.username, socket.uid);
        const msgBody = {
            from_id: socket.uid,
            to_id: parseInt(toId),
            from_name: socket.username,
            to_name: toName,
            content,
            type: 2,
            msg_status: 1,
            create_time: time(),
            flag: `s${toId}_${socket.uid}` // s{from_id}_{to_id} 私聊标识符
        }
        socket.emit('receive_msg_in_chat',{...msgBody,type:1},function(){
            handleSaveMessage({
                ...msgBody,
                type:1,
                msg_status: 2
            }).catch(err => console.log(err));
        }); // 把发送者自己的消息传回去 改一下类型
        
        isUserHasConnection('username', toName)
            .then(res => {
                const { socket_id } = res;
                try {
                    sockets[socket_id].emit('receive_msg', msgBody,
                        // 回调函数 对方在线的话 就发送成功 status置2
                        function () {
                            handleSaveMessage({
                                ...msgBody,
                                msg_status: 2
                            }).catch(err => console.log(err));
                            console.log('发送成功');
                        }
                        );
                
                } catch (e) { // 发送失败
                    console.log(toName + ' 不在线。将此信息存入未发送消息表');
                }
                handleSaveMessage(msgBody).catch(err => console.log(err));

            })
            .catch(err => {
                console.log(err);
            })
    });

    // 监听客户端断开
    socket.on('disconnect', function () {
        handleFreeSocket(socket, socket.uid);
    });

    // 监听连接错误
    socket.on('error', function (err) {
        console.log("连接出现错误", err);
    });

}

function onConnect(socket) {
    console.log(`${socket.handshake.address},connecting....`);
}
function wss(io) {

    io.on('connection', (socket) => onConnectSuc(io, socket));
    io.on('connect', onConnect);

}

module.exports = wss;