const jwt = require('jsonwebtoken')
const User = require('../models/signUp')

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, process.env.SECRET_KEY);
        const data = await User.findByPk(user.userid)
        req.user = data
        next();
    }
    catch (err) {
        console.log(err);
    }
}