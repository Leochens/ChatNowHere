const express = require('express');
const router = express.Router();
const Handlers = require('./handlers');
const bodyParser = require('body-parser');//获取post参数

router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', function (req, res) {
    res.send('hallo dbTest');
})


/**
 * username
 * password
 */
router.post('/login', function (req, res) {

    console.log('post|请求参数:', req.body);
    const data = req.body;
    Handlers.handleLogin(data, res);
})

/**
 * username
 * password
 * email
 * time
 * role 0 | 1
 * pic 
 */
router.post('/register', function (req, res) {
    console.log('post|请求参数:', req.body);
    const data = req.body;
    Handlers.handleRegister(data, res);
});

module.exports = router;
