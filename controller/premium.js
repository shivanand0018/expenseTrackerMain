const User = require('../models/signUp')
const Expense = require('../models/expense')
const sequelize = require('../util/database')

const getLeaderBoard = async (req, res) => {
    try {
        const userLeaderBoard = await User.findAll({
            order: [['totalExpense', 'DESC']]
        });
        res.status(200).json(userLeaderBoard)
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLeaderBoard
}