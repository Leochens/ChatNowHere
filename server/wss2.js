var conn = require('./dbconnect');


/**
 * 根据uid删除user_connect表中的socket连接
 * @param {mix} socket 套接字
 * @param {object} data 包含uid的数据
 */
function handleFreeSocket(socket,data){
    const { uid } = data;

    const sql = `
        delete from connect_user
        where uid = '${uid}'
    `;
    function callback(error){
        if(error){
            socket.emit('err');
            console.log('free socket err');
        }else{
            console.log('释放成功');
        }
    }
    conn.query(sql,callback);

}

/**
 * 在连接表中为某一个用户分配并绑定一个socket连接
 * @param {mix} socket 套接字
 * @param {object} data 插入user_connect表的必要字段
 */
function handleApplySocket(socket,data) {
    const { uid, socket_id, ip } = data;

    const sql =
        `
        INSERT INTO connect_user(
            uid,
            ip,
            socket_id
            ) 
        VALUES(
            '${uid}',
            '${ip}',
            '${socket_id}'
        );
        `;
    function callback(error, result, fileds) {
        if (error) {
            console.log(error);

            let msg = "分配socket出现错误";
            if(error.errno === 1062)
                msg = "该用户已经分配到了socket,不能重复分配";
            socket.emit('apply_socket_err',msg);
        }
        else {
            const msg = {
                msg: '分配socket成功',
                socket_id: socket.id   
            };
            socket.emit('apply_socket_suc',msg)
        }
    }
    conn.query(sql, callback);
}

/**
 * 当客户端发起wss连接时的操作
 * @param {mix} socket 套接字
 */
function onConnect(socket){

    console.log('connecting...');
    
    socket.on('join', function (data) {
        console.log(data);
        socket.uid = data.uid;  // 存下来
        handleApplySocket(socket,{
            uid: data.uid,
            ip: socket.handshake.address,
            socket_id: socket.id
        })
    
    });

    socket.on('disconnect',function(){
        handleFreeSocket(socket,{
            uid: socket.uid
        });
    })

}

function wss(io) {

    io.on('connection',onConnect)

}

module.exports = wss;