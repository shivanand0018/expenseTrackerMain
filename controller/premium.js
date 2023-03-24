const User=require('../models/signUp')
const Expense=require('../models/expense')
const sequelize=require('../util/database')

const getLeaderBoard = async (req, res) => {
    try {
        const users=await User.findAll();
        const expenses=await Expense.findAll();
        const allUserExpenses={};
        expenses.forEach((expense)=>{
            if(allUserExpenses[expense.userId])
            {
                allUserExpenses[expense.userId]=allUserExpenses[expense.userId]+expense.amount
            }
            else{
                allUserExpenses[expense.userId]=expense.amount
            }
        })
        var userLeaderBoard=[];
        users.forEach(user=>{
            userLeaderBoard.push({name:user.name,totalExpenses:allUserExpenses[user.id]||0})
        })
        userLeaderBoard.sort((a,b)=>b.totalExpenses-a.totalExpenses)
        res.status(200).json(userLeaderBoard)

    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLeaderBoard
}