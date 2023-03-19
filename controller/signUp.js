const signUp = require('../models/signUp')

exports.addUser=async(req,res)=>{
    try{
        console.log(req.body);
        const userName=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const data=await signUp.create({
            name:userName,
            email:email,
            password:password
        })
        res.json({data:data})
    }
    catch(err)
    {
        console.log(err);
        res.status(409).json({err:"Email already exists"})
    }
}