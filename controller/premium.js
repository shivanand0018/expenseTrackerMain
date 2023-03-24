const User=require('../models/signUp')
const Expense=require('../models/expense')
const sequelize=require('../util/database')

const getLeaderBoard = async (req, res) => {
    try {
        const userLeaderBoard=await User.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'totalExpenses']],
            include:[{
                model:Expense,
                attributes:[]
            }],
            group:['id'],
            order:[['totalExpenses','DESC']]        }); 
        res.status(200).json(userLeaderBoard)
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLeaderBoard
}