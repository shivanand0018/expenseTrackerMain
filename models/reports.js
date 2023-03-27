const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Reports = sequelize.define('downloads',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true
    },
    url:{
        type: Sequelize.STRING
    } ,
    
})

module.exports = Reports;