const expense = require('../models/expense');
const User = require("../models/signUp");
const sequelize = require('../util/database');
const s3Service=require('../services/s3Service')
const userService=require('../services/userServices')

exports.postExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const category = req.body.category;
        const description = req.body.description;
        const amount = req.body.amount;
        console.log(req.user);
        const data = await expense.create({
            category: category,
            description: description,
            amount: amount,
            userId: req.user.id
        }, { transaction: t })
        const totalExpenses = Number(req.user.totalExpense) + Number(amount)
        await User.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        res.json({ data: data })
    }
    catch (err) {
        console.log(err);
        await t.rollback()
    }
}

exports.getExpenses = async (req, res) => {
    try {
        console.log(req.user);
        const data = await expense.findAll({ where: { userId: req.user.id } });
        res.json({ data: data, premiumUser: req.user.isPremiumUser })
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id
        const resp = await expense.destroy({ where: { id: id, userId: req.user.id }, transaction: t })
        const totalExpenses = Number(req.user.totalExpense) - Number(resp.amount)
        await User.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        res.status(204).json({ resp });
    }
    catch (err) {
        console.log(err);
        await t.rollback();
    }
}

exports.downloadExpense = async (req, res) => {
    try {
        const expenses = await userService.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses)
        const userId = req.user.id
        const filename = `Expense${userId}-${new Date()}.txt`;
        const fileUrl =await s3Service.uploadToS3(stringifiedExpenses, filename)
        await userService.createDownloadHistory(req,fileUrl)
        const download = await userService.getDownloadHistory(req)
        res.status(200).json({ fileUrl, success: true,downloaded:download })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({fileUrl:"",success:false,err:err})
    }
}


