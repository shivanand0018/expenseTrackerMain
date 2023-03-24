var userName = document.getElementById('userName');
var email = document.getElementById('email');
var password = document.getElementById('password')
var form = document.getElementById('form')

async function addUser(e) {
    try {
        if (userName.value == "" || email.value == "" || password.value == "") {
            alert('please fill all the fields')
        }
        else {
            e.preventDefault();
            const obj = {
                name: userName.value,
                email: email.value,
                password: password.value
            }
            console.log(obj);
            const response = await axios.post('http://localhost:3000/signup/addUser', obj)
            userName.value = ""
            email.value = ""
            password.value = ""
            if (document.getElementById('id')) {
                form.removeChild(document.getElementById('id'))
            }
            var p = document.createElement('p')
            p.id='id'
            let text = `<h4 style="color:red">User successfully Registered....! Please Login<h4>`
            p.innerHTML = p.innerHTML + text;
            form.appendChild(p)
        }
    }
    catch (err) {
        console.log(err);
        if(document.getElementById('id'))
        {
            form.removeChild(document.getElementById('id'))
        }
        var p = document.createElement('p')
        p.id='id'
        let text = `<h3 style="color:red">Emailid Already Registered....!<h3>`
        p.innerHTML = p.innerHTML + text;
        form.appendChild(p)

    }
}