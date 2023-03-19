var email = document.getElementById('email');
var password = document.getElementById('password');

async function checkUser(e)
{
    try{
        e.preventDefault();
        const email=email.value;
        const password=password.value;
        let obj={
            email:email,
            password:password
        }
        let data=await axios.post('http://localhost:3000/login/checkUser',obj)
    }
    catch(err)
    {
        console.log(err);
    }
}