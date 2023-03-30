const expense = require('../models/expense');
const User = require("../models/signUp");
const sequelize = require('../util/database');
const s3Service = require('../services/s3Service')
const userService = require('../services/userServices')

exports.postExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const category = req.body.category;
        const description = req.body.description;
        const amount = req.body.amount;
        const data = await expense.create({
            category: category,
            description: description,
            amount: amount,
            userId: req.user.id
        }, { transaction: t })
        const totalExpenses = Number(req.user.totalExpense) + Number(amount)
        await User.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        res.json({ data: data, totalExpense: totalExpenses })
    }
    catch (err) {
        console.log(err);
        await t.rollback()
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const page = +req.query.page || 1;
        const itemsPerPage = Number(req.query.items);
        let expenseCount = await expense.count({ where: { userId: req.user.id } })
        const data1 = await expense.findAll({
            offset: (page - 1) * itemsPerPage,
            limit: itemsPerPage
            , include: [{ model: User, where: { id: req.user.id } }]
        });
        return res.status(200).json({
            data: data1,
            premiumUser: req.user.isPremiumUser,
            currentPage: page,
            hasNextPage: expenseCount > (page * itemsPerPage),
            nextPage: page + 1,
            hasPrevPage: page > 1,
            prevPage: page - 1,
            itemsPerPage: itemsPerPage,
            lastPage: Math.ceil(expenseCount / itemsPerPage),
            totalExpense: req.user.totalExpense,
            name:req.user.name
        })
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id
        const expenses = await expense.findOne({ where: { id: id } })
        const resp = await expense.destroy({ where: { id: id, userId: req.user.id }, transaction: t })
        const totalExpenses = Number(req.user.totalExpense) - Number(expenses.amount)
        await User.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        return res.status(200).json({ totalExpense: totalExpenses });
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
        const fileUrl = await s3Service.uploadToS3(stringifiedExpenses, filename)
        await userService.createDownloadHistory(req, fileUrl)
        const download = await userService.getDownloadHistory(req)
        res.status(200).json({ fileUrl, success: true, downloaded: download })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ fileUrl: "", success: false, err: err })
    }
}

exports.getExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id
        const resp = await expense.findByPk(id)
        const totalExpenses = Number(req.user.totalExpense) - Number(resp.amount)
        await User.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });

        res.json({ data: resp })
        await t.commit();
    }
    catch (err) {
        await t.rollback();
        console.log(err);
    }
}

exports.updateExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const date = req.body.date;
        const category = req.body.category;
        const description = req.body.description;
        const amount = req.body.amount;
        const resp1 = await expense.upsert({
            id: id,
            date: date,
            category: category,
            description: description,
            amount: amount
        }, { transaction: t })
        const totalExpenses = Number(req.user.totalExpense) + Number(amount)
        await User.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        res.json({
            data: {
                id: id,
                date: date,
                category: category,
                description: description,
                amount: amount
            },
            totalExpense: totalExpenses
        })

    }
    catch (err) {
        console.log(err);
    }
}




