const express = require('express')
const router = express.Router();
const path = require('path')
const controller=require('../controller/home')
const userAuth=require('../middleware/auth')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'home.html'))
})

router.post('/postExpense',userAuth.authenticate,controller.postExpense)

router.get('/getExpenses',userAuth.authenticate,controller.getExpenses)

router.delete('/delete/:id',userAuth.authenticate,controller.deleteExpense)

module.exports=router