const jwt=require('jsonwebtoken')
const User=require('../models/signUp')

exports.authenticate=async(req,res,next)=>{
    try{
        const token=req.header('Authorization')
        const user=jwt.verify(token,'shivanand');
        const data=await User.findByPk(user.userid)
        console.log(data);
        req.user=data
        next();
    }
    catch(err)
    {

    }
}