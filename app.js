const express = require('express')
const path = require('path')
const cors = require('cors')
const Expense = require('./models/expense')
const User = require('./models/signUp')
const ForgotPass = require('./models/forgotPassword')
const jwt = require('jsonwebtoken')
const Razorpay = require('razorpay');
const morgan=require('morgan')
const fs=require('fs')
require('dotenv').config();

const app = express();
const bodyparser = require('body-parser')


app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

const sequelize = require('./util/database')
const signUpRoutes = require('./routes/signUp');
const loginRoutes = require('./routes/login')
const homeRoutes = require('./routes/home')
const purchaseRoutes = require('./routes/purchase')
const Order = require('./models/orders')
const premiumRoutes = require('./routes/premiumFeautureRoutes')
const forgotPassRoutes = require('./routes/forgotPassword')
const History = require('./models/reports')

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
ForgotPass.belongsTo(User)
User.hasMany(ForgotPass);
History.belongsTo(User)
User.hasMany(History);

app.use('/signup', signUpRoutes)
app.use('/login', loginRoutes)
app.use('/home', homeRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumRoutes)
app.use('/password', forgotPassRoutes)
app.use('', async (req, res) => res.redirect('login'))

sequelize.sync().then(() => {
    app.listen(process.env.PORT ||3000)
})
