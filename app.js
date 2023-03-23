const express=require('express')
const path=require('path')
const cors=require('cors')
const Expense=require('./models/expense')
const User=require('./models/signUp')
const jwt=require('jsonwebtoken')
const Razorpay = require('razorpay'); 

const app=express();
const bodyparser = require('body-parser')
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_XjZ0WwA0d5qX7w',
    key_secret: '4aBbzgRGkLdzRB00EGvjYMLy'
});

app.use(express.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))
const sequelize = require('./util/database')
const signUpRoutes = require('./routes/signUp');
const loginRoutes=require('./routes/login')
const homeRoutes=require('./routes/home')
const purchaseRoutes=require('./routes/purchase')
const Order = require('./models/orders')

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User)

app.use('/signup', signUpRoutes)
app.use('/login',loginRoutes)
app.use('/home',homeRoutes)
app.use('/purchase',purchaseRoutes)

sequelize.sync().then(()=>{
    app.listen('3000')
})