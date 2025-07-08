const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const UserVerification = require("../models/UserVerification");

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail"
,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

transporter.verify((err, success) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("ready for messages");
        console.log(success)
    }
})
const sendMail = async ({_id, email, firstName}) => {

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        const alreadyExist = await UserVerification.findOne({ userId: _id })
        if (!alreadyExist) {
            await UserVerification.create({
                userId: _id,
                verificationCode: hashedOtp,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            })
        }
        else if (alreadyExist.expiresAt < new Date()) {
            await UserVerification.findByIdAndDelete(alreadyExist._id);
            await UserVerification.create({
                userId: _id,
                verificationCode: hashedOtp,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
            })
        }
        else {
            await UserVerification.findOneAndUpdate(
                { userId: _id },
                {
                    verificationCode: hashedOtp,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                }
            );
        }

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Your Verification Code - Complete Your Signup",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #007BFF;">Verify Your Email Address</h2>
                <p>Hello ${firstName},</p>
                <p>Thank you for signing up for <strong>Your App Name</strong>! Please use the verification code below to complete your registration:</p>
                <div style="font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 10px; width: fit-content; margin: 20px 0;">
                    <span style="letter-spacing: 3px;">${otp}</span>
                </div>
                <p>This code is valid for the next 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
                <p>Best regards,<br><strong>Your App Name</strong> Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { status: "pending", message: "Verification Email Sent" }

    } catch (error) {
        console.error("Error sending verification email: ", error);
        throw new Error("Could not send verification email. Please try again")
    }

}

module.exports = sendMail