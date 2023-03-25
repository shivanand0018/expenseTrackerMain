var email=document.getElementById('email')
async function forgotPassword(e)
{
    try{
        e.preventDefault();
        let obj={
            email:email.value
        }
        const data=await axios.post('http://localhost:3000/password/forgotPassword',obj)
    }
    catch(err)
    {
        console.log(err);
    }
}