import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

interface SendEmailInput {
    to: string;
    subject: string;
    html: string;
}

interface SendOtpEmailInput {
    email: string;
    otp: string;
}

const sendEmail = async ({ to, subject, html }: SendEmailInput) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        })
        return info;
    } catch (error) {
        throw new Error("Failed to send email")
    }
}

const sendOtpEmail = async ({ email, otp }: SendOtpEmailInput) => {
    try {
        const info = await sendEmail({
            to: email, subject: "Verify Your Account", html: `
            <h2>Email Verification</h2>
<p>Thanks for signing up!</p>
<p>Your verification code is:</p>
<h1>${otp}</h1>
<p>This OTP is valid for 10 minutes.</p>
`})
        return info;
    } catch (error) {
        throw new Error("Failed to send OTP email")
    }
}

export { sendEmail, sendOtpEmail }