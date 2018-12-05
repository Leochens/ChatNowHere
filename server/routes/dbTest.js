const express = require('express');
const router = express.Router();
const Handlers = require('./handlers');
const bodyParser = require('body-parser');//获取post参数

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
    Handlers.handleLogin(data, res,req);
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
