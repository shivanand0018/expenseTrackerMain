const express = require('express')
const router = express.Router();
const path = require('path')
const loginController=require('../controller/login')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'))
})

router.post('/checkUser',loginController.checkUser)
module.exports = router