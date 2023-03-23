const Razorpay = require('razorpay')
const Order = require('../models/orders')

exports.purchasePremium = async (req, res) => {
    try {
        const cookie = "SameSite=None;secure";
        res.setHeader("set-cookie", [cookie])
        var rzp = new Razorpay({
            key_id: 'rzp_test_bOZpfH9EsNpVn5',
            key_secret: '8Y1NyclBpFFY0OifV0DRzWXP'
        })
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            console.log(order);
            const data = req.user.createOrder({ orderid: order.id, status: 'PENDING' });

            return res.json({ order, key_id: rzp.key_id })

        })
    }
    catch (err) {
        console.log(err);
    }
}

exports.updateTransaction = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } })
        console.log(order);
        if (payment_id == null) {
            const updateOrder = order.update({ paymentId: payment_id, status: 'FAILED' })
            const updateUser = req.user.update({ premiumUser: false })
            Promise.all([updateOrder, updateUser]).then(() => {
                return res.status(202).json({ success: false, message: 'Transaction Failed' })
            }).catch(err => {
                throw new Error(JSON.stringify(err))
            })
        }
        else {
            console.log('hi');
            const updateOrder = order.update({ paymentId: payment_id, status: 'SUCCESSFUL' })
            const updateUser = req.user.update({ isPremiumUser: true })
            Promise.all([updateOrder, updateUser]).then(() => {
                return res.status(202).json({ success: true, message: 'Transaction Successful' })
            }).catch(err => {
                throw new Error(JSON.stringify(err))
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}

