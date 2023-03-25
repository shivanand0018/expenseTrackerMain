const Sib = require('sib-api-v3-sdk')

exports.getPassword = async (req, res) => {
    try {
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.SENDINBLUE_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sender = {
            email: 'shivanand0018@gmail.com'
        }
        const receivers = [
            {
                email: 'shivanandgoud615@gmail.com'
            },
        ]
        const data = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Forgot Password',
            htmlContent: `<a>Reset Password</a>`
        })
    }
    catch(err)
    {
        console.log(err);
    }
}