const express = require('express')
const router = express.Router();
const path = require('path')
const controller=require('../controller/home')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'home.html'))
})

router.post('/postExpense',controller.postExpense)

router.get('/getExpenses',controller.getExpenses)

router.delete('/delete/:id',controller.deleteExpense)

module.exports=router