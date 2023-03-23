
const expenseTable = document.getElementById('expenseTable');
var category = document.getElementById('category')
var description = document.getElementById('description')
var amount = document.getElementById('amount')


async function addExpense(e) {
    try {
        e.preventDefault();
        if (category.value == "" || description.value == "" || amount.value == "") {
            alert('Please fill all the details')
        }
        else {
            const obj = {
                category: category.value,
                description: description.value,
                amount: amount.value
            }
            const token = localStorage.getItem('token')
            const res = await axios.post('http://localhost:3000/home/postExpense', obj, { headers: { "Authorization": token } })
            showData(res.data.data)
            category.value = '';
            description.value = '';
            amount.value = '';

        }
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:3000/home/getExpenses', { headers: { "Authorization": token } })
        for (let i = 0; i < res.data.data.length; i++) {
            showData(res.data.data[i]);
        }
    }
    catch (err) {
        console.log(err);
    }
})

function showData(data) {
    let text = `<tr id=${data.id}>
                <td>${data.category}</td>
                <td>${data.description}</td>
                <td>$${data.amount}</td>
                <td><button onclick="editExpense(${data.id})">
                    Edit</button></td>
                <td><button class="deleteButton" onclick="deleteExpense(${data.id},${data.amount})">
                    Delete</button></td>
            </tr>`;
    expenseTable.innerHTML = expenseTable.innerHTML + text;
}

async function deleteExpense(id, amount) {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.delete(`http://localhost:3000/home/delete/${id}`, { headers: { "Authorization": token } })
        let tr = document.getElementById(id);
        expenseTable.removeChild(tr);
    }
    catch (err) {
        console.log(err);
    }
}

document.getElementById('rzp-button1').onclick =async function(e){
    try {
        console.log('A');
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/purchase/premiumMembership', { headers: { "Authorization": token } })
        console.log(response);
        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                await axios.post('http://localhost:3000/purchase/updateTransaction', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { 'Authorization': token } })
                alert('You are a premium User')
            }

        }
        const rzp1=new Razorpay(options)
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed',async function(response)
        {
            const resp=await axios.post("http://localhost:3000/purchase/update-transaction",{
                "orderId":response.data.order.id,
                "payment_id":null
            },{headers:{"Authorization":token} })
            alert('something went wrong')
        })
    }
    catch (err) {
        console.log(err);
    }
}