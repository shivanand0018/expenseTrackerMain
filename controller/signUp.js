const signUp = require('../models/signUp')
const bcrypt = require('bcrypt')
const sequelize=require('../util/database')

exports.addUser = async (req, res) => {
    try {
        const t=await sequelize.transaction();
        const userName = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        bcrypt.hash(password, 10, async (err, hash) => {
            const data = await signUp.create({
                name: userName,
                email: email,
                password: hash
            },{transaction:t})
            await t.commit();
            res.json({ data: data })
        })
        
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({message: false, data: "Email already exists" })
    }
}