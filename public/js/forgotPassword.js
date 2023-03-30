var email=document.getElementById('email')
const form=document.getElementById('form')
async function forgotPassword(e)
{
    try{
        e.preventDefault();
        let obj={
            email:email.value
        }
        const data=await axios.post('http://localhost:3000/password/forgotPassword',obj)
        console.log(data);
        email.value=""
        if(data.status==200)
        {
            if (document.getElementById('id')) {
                form.removeChild(document.getElementById('id'))
            }
            var p = document.createElement('p')
            p.id = 'id'
            let text = `<h3>Reset Password link sent to your Email<h3>`
            p.innerHTML = p.innerHTML + text;
            form.appendChild(p)
        }
    }
    catch(err)
    {
        console.log(err);
    }
}