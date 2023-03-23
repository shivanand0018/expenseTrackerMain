const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        unique:true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING
    },
    isPremiumUser:Sequelize.BOOLEAN
})

module.exports = Users;