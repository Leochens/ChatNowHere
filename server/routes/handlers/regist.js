const conn = require('../../dbconnect');


function handleRegist(data, res) {
    const {
        username,
        password,
        email,
        last_login_ip,
        role,
        status,
        pic
    } = data;
    const sql =
        `
        INSERT INTO users(
            username,
            password,
            email,
            last_login_ip,
            role,
            status,
            pic)
        VALUES(
            '${username}',
            '${password}',
            '${email | 'no email'}',
            '${last_login_ip || null}',
            '${role || 0}',
            '${status || 1}',
            '${pic || ' '}'
        );
        `;
    function callback(error, result, fileds) {
        if (error) {
            console.log(error);
            const _data = {
                msg :"注册出现错误",
                status: 101
            };
            //ER_DUP_ENTRY
            if(error.errno === 1062){
                _data.msg += " 名字重复了"
            }
            
            res.send(_data);
        }
        else {
            res.send({
                status: 200,
                msg: '注册成功'
            });
        }
    }
    conn.query(sql, callback);
}

module.exports = handleRegist;