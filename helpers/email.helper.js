import nodemailer from 'nodemailer'



const send = async infoObj => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SMTP,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        let info = await transporter.sendMail(infoObj);
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (error) {
        console.log(error)
        
    }
    
}
export const emailProcessor = ({ fname, email, pin }) => {
    const link = `http://localhost:3000/email-verifiation?pin=${pin}&email=${email}`
    let info = {
        from: `"ESHOP Nepal 👻" <${process.env.EMAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Email confirmation Required", // Subject line
        text: `Hi ${fname} ,please follow the link below to confirm your email.${link}`, // plain text body
        html: `Hello ${fname},
        <br/>
        please follow the link below to confirm your email.${link} <br/>
        Thank you <br/>
        Kind Regards,`, // html body
    }
    send(info);
    }

