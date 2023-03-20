const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Expenses = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING
    },
    amount: Sequelize.DOUBLE
})

module.exports = Expenses;