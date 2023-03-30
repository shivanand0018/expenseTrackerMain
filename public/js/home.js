const expenseTable = document.getElementById('expenseTable');
var category = document.getElementById('category')
var description = document.getElementById('description')
var amount = document.getElementById('amount')
const itemsPerPage = document.getElementById("itemsPerPage");
itemsPerPage.addEventListener('click', getExpense);
const token = localStorage.getItem('token')

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
            const res = await axios.post('http://54.174.163.159:3000/home/postExpense', obj, { headers: { "Authorization": token } })
            let total = document.getElementById('total')
            total.innerHTML = 'Total Expenses=' + res.data.totalExpense
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
        let page = 1
        const res = await axios.get(`http://54.174.163.159:3000/home/getExpenses?page=${page}&items=${itemsPerPage.value}`, { headers: { "Authorization": token } })
        console.log(res);
        let btn2=document.createElement('h4')
        btn2.innerHTML='Welcome '+(res.data.name).toUpperCase();
        let btn3=document.getElementById('div')
        btn2.id='name'
        btn3.appendChild(btn2)
        let btn12 = document.getElementById('board')
        btn12.disabled = true;
        let p1=document.getElementById('p1')
        let p=document.createElement('p')
        p.innerHTML='Only Premium Users can see Leaderboard and download Reports'
        p.id='p'
        p1.appendChild(p)
        if (res.data.premiumUser === true) {
            var btn = document.getElementById('rzp-button1')
            let text = 'You are a premium User'
            btn.innerHTML = text;
            btn.disabled = true;
            let btn12 = document.getElementById('board')
            btn12.disabled = false;
            p1.removeChild(p)
        }
        let total = document.getElementById('total')
        total.innerHTML = 'Total Expenses=' + res.data.totalExpense
        const pageData = res.data
        pagination(pageData)
    }
    catch (err) {
        console.log(err);
    }
})

async function getExpense(page) {
    try {
        let getReq = await axios.get(`http://54.174.163.159:3000/home/getExpenses?page=${page}&items=${itemsPerPage.value}`, { headers: { 'Authorization': token } })
        const pageData = getReq.data;
        let total = document.getElementById('total')
        total.innerHTML = 'Total Expenses=' + getReq.data.totalExpense
        expenseCount = pageData.length;
        pagination(pageData);
    } catch (err) {
        console.log("ERR in getExpense main.js_expense ", err)
    }
}

function pagination(obj) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = "";
    if (obj.hasPrevPage) {
        const btnPrev = document.createElement('button');
        btnPrev.type = "button";
        btnPrev.innerHTML = obj.prevPage;
        btnPrev.addEventListener('click', () => getExpense(obj.prevPage))
        pagination.appendChild(btnPrev)
    }
    const btn = document.createElement('button');
    btn.type = "button";
    btn.innerHTML = `<h4>${obj.currentPage}</h4>`
    expenseTable.innerHTML = '';
    for (let i = 0; i < obj.data.length; i++) {
        showData(obj.data[i])
    }
    console.log(obj.data)
    pagination.appendChild(btn)
    if (obj.hasNextPage) {
        const btnNext = document.createElement('button');
        btnNext.type = "button";
        btnNext.innerHTML = obj.nextPage;
        btnNext.addEventListener('click', () => getExpense(obj.nextPage))
        pagination.appendChild(btnNext)
    }
    if (obj.lastPage != obj.currentPage) {
        const lastbtn = document.createElement('button');
        lastbtn.type = 'button';
        lastbtn.innerHTML = '>>'
        lastbtn.addEventListener('click', () => getExpense(obj.lastPage))
        pagination.appendChild(lastbtn)
    }
}

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
    expenseTable.innerHTML = text + expenseTable.innerHTML;
}

async function deleteExpense(id) {
    try {
        const res = await axios.delete(`http://54.174.163.159:3000/home/delete/${id}`, { headers: { "Authorization": token } })
        let total = document.getElementById('total')
        total.innerHTML = 'Total Expenses=' + res.data.totalExpense
        let tr = document.getElementById(id);
        expenseTable.removeChild(tr);
    }
    catch (err) {
        console.log(err);
    }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    try {
        const response = await axios.get('http://54.174.163.159:3000/purchase/premiumMembership', { headers: { "Authorization": token } })
        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                const res = await axios.post('http://54.174.163.159:3000/purchase/updateTransaction', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { 'Authorization': token } })
                alert('You are a premium User')
                var btn = document.getElementById('rzp-button1')
                let text = 'You are a premium User'
                btn.innerHTML = text;
                btn.disabled = true;
                btn.style.cursor = 'none';
                let btn12 = document.getElementById('board')
                btn12.disabled = false;
            }
        }
        const rzp1 = new Razorpay(options)
        rzp1.open();
        e.preventDefault();
        rzp1.on('payment.failed', async function () {
            console.log(response)
            const resp = await axios.post("http://54.174.163.159:3000/purchase/updateTransaction", {
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
    if (document.getElementById('leaderboard')) {
        let table = document.getElementById('table');
        table.removeChild(document.getElementById('leaderboard'))
    }
    if (!document.getElementById('leaderboard')) {
        const data = await axios.get('http://54.174.163.159:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
        var tb = document.createElement('table')
        tb.id = 'leaderboard'
        let table = document.getElementById('table');
        let text = `<div><h3 style="text-align: center";>Leader Board</h3></div><tr><th>Rank</th><th>Name</th><th>Expenses</th></tr><tr>`
        tb.innerHTML = text;
        let a = 1
        for (let i = 0; i < data.data.length; i++) {
            let text = `<td>${a}</td><td>${data.data[i].name}</td><td>${data.data[i].totalExpense}</td></tr>`
            a++;
            tb.innerHTML = tb.innerHTML + text;
        }
        table.appendChild(tb)
    }
}

async function downloadFile() {
    try {
        const res = await axios.get('http://54.174.163.159:3000/home/download', { headers: { "Authorization": token } })
        if (res.status == 200) {
            displayDownloadHistory(res.data.downloaded)
            var a = document.createElement("a");
            a.href = res.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(res.data.message)
        }
    }
    catch (err) {
        console.log(err);
    }
}

function displayDownloadHistory(data) {
    if (document.getElementById('leaderboard')) {
        let table = document.getElementById('table');
        table.removeChild(document.getElementById('leaderboard'))
    }
    if (!document.getElementById('leaderboard')) {
        var tb = document.createElement('table')
        
        tb.id = 'leaderboard'
        let text = `<div><h3 style="text-align: center";>Reports Downloaded History</h3></div><tr><th>S.No</th><th>Url</th><th>Downloaded at</th></tr><tr>`
        tb.innerHTML = text;
        
        let a = 1
        for (let i = 0; i < data.length; i++) {
            let text = `<td>${a}</td><td><a href=${data[i].url}>link</td><td>${data[i].createdAt}</td></tr>`
            a++;
            tb.innerHTML = tb.innerHTML + text;
        }
        let table = document.getElementById('table');
        table.appendChild(tb)
        
    }
}

async function editExpense(id) {
    try {
        const resp = await axios.get(`http://54.174.163.159:3000/home/getExpense/${id}`, { headers: { "Authorization": token } })
        category.value = resp.data.data.category;
        description.value = resp.data.data.description;
        amount.value = resp.data.data.amount;
        console.log(resp.data);
        const totalexp=resp.data.totalExpenses-resp.data.data.amount
        let tr = document.getElementById(id);
        let btn2 = document.getElementById('submitbtn')
        btn2.style.visibility = 'hidden'
        expenseTable.removeChild(tr);
        var btn = document.createElement('button')
        btn.appendChild(document.createTextNode('Update'))
        btn.id = "update"
        var btn1 = document.getElementById('but')
        btn1.appendChild(btn)
        btn.onclick = async () => {
            let obj = {
                category: category.value,
                description: description.value,
                amount: amount.value,
                total:totalexp
            }
            const resp1 = await axios.put(`http://54.174.163.159:3000/home/updateExpense/${id}`, obj, { headers: { "Authorization": token } })
            btn1.removeChild(btn)
            let total = document.getElementById('total')
            total.innerHTML = 'Total Expenses=' + resp1.data.totalExpense
            showData(resp1.data.data)
            btn2.style.visibility = 'visible'
            category.value = '';
            description.value = '';
            amount.value = '';
        }
    }
    catch (err) {
        console.log(err);
    }
}

function logout()
{
    localStorage.removeItem('token')
    window.location.href='/login'
}

