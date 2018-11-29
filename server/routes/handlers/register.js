const conn = require('../../dbconnect');


function handleRegister(data, res) {
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
            let msg = "注册出现错误";
            //ER_DUP_ENTRY
            if(error.errno === 1062)
                msg += " 名字重复了"
            
            res.send({msg});
        }
        else {
            res.send({
                msg: '注册成功'
            });
        }
    }
    conn.query(sql, callback);
}

module.exports = handleRegister;