const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/signUp')
const sequelize = require('../util/database')
const Forgot = require('../models/forgotPassword')
require('dotenv').config()
const path = require('path')
const bcrypt = require('bcrypt')

exports.getPassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {

        console.log(req.body);
        const user = await User.findOne({ where: { email: req.body.email }, transaction: t });
        console.log(user);
        console.log(uuidv4());
        if (user) {
            const id = uuidv4();
            const createForgot = await Forgot.create({
                id: id,
                isActive: true,
                userId: user.id
            }, { transaction: t })
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key']
            apiKey.apiKey = process.env.SENDINBLUE_KEY;
            const tranEmailApi = new Sib.TransactionalEmailsApi()
            const sender = {
                email: 'shivanand0018@gmail.com'
            }
            const receivers = [
                {
                    email: req.body.email
                },
            ]
            const data = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Forgot Password',
                htmlContent: `<p>Expense Tracker -Please click on the link sent, to reset your password.</p><a href="http://54.174.163.159:3000/password/resetPassword/${id}">Reset Password</a>`
            })
            await t.commit()
            res.status(200).json({ data: data })
        }
        else {
            res.status(402).json({ message: 'No user found' })
        }
    }
    catch (err) {
        await t.rollback();
        console.log(err);
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const forgotId = req.params.id
        const forgotPass = await Forgot.findOne({ where: { id: forgotId } })
        if (forgotPass.isActive) {
            forgotPass.update({ isActive: false })
            res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link href="/css/signUp.css" rel="stylesheet">
            </head>
            <body>
                <header>
                    <nav class="nav">
                        <div>
                            <h3>Expense Tracker</h3>
                        </div>
                    </nav>
                </header>
                <main>
                    <form id="form" class="form" method="POST" onsubmit="updatePassword(event)">
                        <h2>Reset Password</h2>
                        <div class="form-div">
                            <label>Enter your new Password</label>
                            <input type="password" name="password" id="password" required>
                            <button type="submit">Submit</button>
                            </div>
                    </form>
                </main>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>
            <script>
            const password=document.getElementById('password')
            const form=document.getElementById('form')
            async function updatePassword(e)
            {
                try{
                    e.preventDefault();
                    let obj={
                        password:password.value
                    }
                    const data=await axios.post('http://54.174.163.159:3000/password/updatePassword/${forgotId}',obj)
                    console.log(data)
                    password.disabled=true
                    var p = document.createElement('p')
                    p.id = 'id'
                    let text = '<h3 style="color:red">Password Updated Successfully</h3>'
                    p.innerHTML = p.innerHTML + text;
                    form.appendChild(p)
                    
                }
                catch(err)
                {
                    console.log(err);
                }
            }
            </script>
            </html>`)
        }
        else {
            res.send('<body>Reset Link Expired</body>')
            res.end()
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.updatePassword = async (req, res) => {
    try {
        console.log(req.body);
        const password = req.body.password;
        const forgotId = req.params.id
        const user = await Forgot.findOne({ where: { id: forgotId } })
        const userId = user.userId
        bcrypt.hash(password, 10, async (err, hash) => {
            const data = await User.update({
                password: hash
            }, { where: { id: userId } })
            console.log(data[0]);
            if (data[0] === 1) {
                res.send('<html><body>Password Updated Successfully</body></html>')
                res.end()
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ messgae: err })
    }
}