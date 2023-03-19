const express=require('express')
const path=require('path')
const cors=require('cors')

const app=express();
const bodyparser = require('body-parser')

app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))
const sequelize = require('./util/database')
const signUpRoutes = require('./routes/signUp');

app.use('/signup', signUpRoutes)

sequelize.sync().then(()=>{
    app.listen('3000')
})