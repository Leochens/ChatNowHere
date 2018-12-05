const conn = require('../../dbconnect');


function handleLogin(data, res,req) {
    const { username, password } = data;
    const resData = {};
    const sql =
        `select * from users 
        where username='${username}' and 
        password = '${password}'`;
    function callback(error, result, fileds) {
        if (error) {
            console.log(error);
            resData.msg = "登录出现错误";
            resData.code = 101;
            res.send(resData);
        }
        else {
            if(result.length){
                resData.msg =  "登录成功" ;
                resData.uid = result[0].id;
                resData.username = username;
                resData.user_pic = result[0].user_pic;
                resData.token = '88759';
                resData.code = 200;
                console.log(username+"登录成功")
            } else{
                resData.code = 100;
                resData.msg = "登录失败";
            }
            res.send(resData);
        }
    }
    conn.query(sql, callback);
}


module.exports = handleLogin;