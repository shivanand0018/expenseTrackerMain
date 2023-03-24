
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
        console.log(res);
        if (res.data.premiumUser === true) {
            var btn = document.getElementById('rzp-button1')
            let text = 'You are a premium User'
            btn.innerHTML = text;
            btn.disabled = true;
        }
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

document.getElementById('rzp-button1').onclick = async function (e) {
    try {
        console.log('A');
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/purchase/premiumMembership', { headers: { "Authorization": token } })
        console.log(response);
        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                const res = await axios.post('http://localhost:3000/purchase/updateTransaction', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { 'Authorization': token } })
                alert('You are a premium User')
                var btn = document.getElementById('rzp-button1')
                let text = 'You are a premium User'
                btn.innerHTML = text;
                btn.disabled = true;

            }

        }
        const rzp1 = new Razorpay(options)
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', async function () {
            console.log(response)
            const resp = await axios.post("http://localhost:3000/purchase/updateTransaction", {
                "order_id": response.data.order.id,
                "payment_id": null
            }, { headers: { "Authorization": token } })
            alert('something went wrong')
        })
    }
    catch (err) {
        console.log(err);
    }
}

async function getLeaderBoard() {
    if (!document.getElementById('leaderboard')) {
        const token=localStorage.getItem('token')
        const data=await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token }} )
        console.log(data);
        var tb = document.createElement('table')
        tb.id = 'leaderboard'
        let text = `<div><h3 style="text-align: center";>Leader Board</h3></div><tr><th>S.No</th><th>Name</th><th>Expenses</th></tr><tr>`
        tb.innerHTML = text;
        let a=1
        for(let i=0;i<data.data.length;i++)
        {
            let text=`<td>${a}</td><td>${data.data[i].name}</td><td>${data.data[i].totalExpense}</td></tr>`
            a++;
            tb.innerHTML =tb.innerHTML+ text;
        }
        let table = document.getElementById('table');
        table.appendChild(tb)
    }
}