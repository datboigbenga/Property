const sendEmail =require("./sendEmail");


const sendVerificationEmail= async({firstname, email, verificationToken, origin})=>{

    const verificationLink = `${origin}/api/v1/auth/verifyEmail?token=${verificationToken}&email=${email}`

    const message = `<h5>please confirm your email by clicking the following link:
    <a href="${verificationLink}">Click!</a></h5>`
    return sendEmail({
        to:email,
        subject: "Email Confirmation",
        html: `Hello ${firstname},
        ${message}` 
    })
}

module.exports = sendVerificationEmail;