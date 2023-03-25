const express = require('express')
const router = express.Router();
const path = require('path')
const forgotPassRoutes=require('../controller/forgotPassword')
router.get('/',(req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'forgotPassword.html'))
})

router.post('/forgotPassword',forgotPassRoutes.getPassword)

module.exports=router