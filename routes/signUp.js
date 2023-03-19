const express = require('express')
const router = express.Router();
const path = require('path')
const signUpController=require('../controller/signUp')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'signUp.html'))
})

router.post('/addUser', signUpController.addUser)

module.exports = router