const express = require('express')
const router = express.Router();
const purchaseController=require('../controller/purchase')
const authController=require('../middleware/auth')

router.get('/premiumMembership',authController.authenticate,purchaseController.purchasePremium)

router.post('/updateTransaction',authController.authenticate,purchaseController.updateTransaction)

module.exports=router