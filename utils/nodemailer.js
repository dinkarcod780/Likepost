const nodemailer = require('nodemailer')

const mail = (res,user)=>{
    console.log(user.createdBy.email)
    const transport = nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user: "dinkardiwakar0@gmail.com",
            pass: "qtwf fgzp ghks bkjd",
        }
    })

    const mailOptions= {
        from:'like noteify <like@gmail.com>',
        to:user.createdBy.email,
        subject:"soemone like your post",
        text:"someoen liked you post",
        html:`<a href="/">home</a>`
    }

    transport.sendMail(mailOptions,(err,info)=>{
        res.redirect('/')
    })
    
}

module.exports = mail