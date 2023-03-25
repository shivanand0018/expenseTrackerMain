const express = require('express')
const router = express.Router();
const path = require('path')
const forgotPassRoutes=require('../controller/forgotPassword')
router.get('/',(req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'forgotPassword.html'))
})

router.post('/forgotPassword',forgotPassRoutes.getPassword)

router.get('/resetPassword/:id',forgotPassRoutes.resetPassword)

router.post('/updatePassword/:id',forgotPassRoutes.updatePassword)


module.exports=router