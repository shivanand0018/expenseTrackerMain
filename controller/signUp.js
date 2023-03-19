const signUp = require('../models/signUp')
const bcrypt = require('bcrypt')

exports.addUser = async (req, res) => {
    try {
        console.log(req.body);
        const userName = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        bcrypt.hash(password, 10, async (err, hash) => {
            const data = await signUp.create({
                name: userName,
                email: email,
                password: hash
            })
            res.json({ data: data })
        })
        
    }
    catch (err) {
        console.log(err);
        res.status(409).json({ data: "Email already exists" })
    }
}