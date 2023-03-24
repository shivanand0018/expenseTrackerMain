const expense=require('../models/expense')

exports.postExpense=async(req,res)=>{
    try {
        console.log('hi');
        const category = req.body.category;
        const description = req.body.description;
        const amount = req.body.amount;
        console.log(req.user);
        const data=await expense.create({
            category: category,
            description: description,
            amount: amount,
            userId:req.user.id
        })
        res.json({ data: data })
    }
    catch (err) {
        console.log(err);
    }
}

exports.getExpenses = async (req, res) => {
    try {
        console.log(req.user);
        const data = await expense.findAll({where:{userId:req.user.id}});
        res.json({ data: data,premiumUser:req.user.isPremiumUser })
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const id = req.params.id
        const resp = await expense.destroy({ where: { id: id , userId:req.user.id} })
        res.status(204).json({ resp });
    }
    catch (err) {
        console.log(err);
    }
}