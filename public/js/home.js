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
            const token=localStorage.getItem('token')
            const res = await axios.post('http://localhost:3000/home/postExpense', obj,{headers:{"Authorization":token}})
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
        const token=localStorage.getItem('token')
        const res = await axios.get('http://localhost:3000/home/getExpenses',{headers:{"Authorization":token}})
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
        const token=localStorage.getItem('token')
        const res = await axios.delete(`http://localhost:3000/home/delete/${id}`,{headers:{"Authorization":token}})
        let tr = document.getElementById(id);
        expenseTable.removeChild(tr);
    }
    catch (err) {
        console.log(err);
    }
}