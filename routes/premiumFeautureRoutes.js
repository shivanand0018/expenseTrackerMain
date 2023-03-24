const express=require('express')
const authorization=require('../middleware/auth')
const router=express.Router();
const premium=require("../controller/premium")

router.get('/showLeaderBoard',authorization.authenticate,premium.getLeaderBoard)

module.exports=router

