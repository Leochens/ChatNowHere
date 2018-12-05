const express = require('express');
const router = express.Router();
const Handlers = require('./handlers');
const bodyParser = require('body-parser');//获取post参数
const conn = require('../dbconnect');
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', function (req, res) {
    res.send('hallo dbTest');
})


/**
 * username
 * password
 */
router.post('/login', function (req, res) {
    const data = JSON.parse(Object.keys(req.body)[0]);
    console.log('post|请求参数:', data);
    Handlers.handleLogin(data, res, req);
})

router.get('/search/:username', function (req, res) {

    const { username } = req.params;
    conn.query(`SELECT * FROM users WHERE username LIKE '%${username}%'`, function (err, result) {
        if (err) {
            console.log(err);
            return res.send({
                code: 101,
                msg: '查询用户出现错误'
            });
        }
        if (result.length === 0) {

            return res.send({
                code: 100,
                msg: '无匹配结果'

            })
        }
        return res.send({
            code: 200,
            list: result,
            msg: '查询成功'
        })
    });
})

/**
 * username
 * password
 * email
 * time
 * role 0 | 1
 * pic 
 */
router.post('/regist', function (req, res) {
    console.log('post|请求参数:', req.body);

    const data = JSON.parse(Object.keys(req.body)[0]);
    Handlers.handleRegist(data, res);
});

module.exports = router;
