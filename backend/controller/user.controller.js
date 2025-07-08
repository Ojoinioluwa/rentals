const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const UserVerification = require("../models/UserVerification");
const validator = require("validator");
const validatePassword = require("../utils/passwordValidator");


// TODO: ensure to make sure that the user is verified to be able to login or continue with the action


const userController = {
    // register the user 
    register: asyncHandler(async (req, res) => {
        const { firstName, lastName, email, phoneNumber, password, userType } = req.body

        if (!firstName || !lastName || !email || !phoneNumber || !password || !userType) {
            res.status(400)
            throw new Error('All fields are requried');
        }


        if (!validator.isEmail(email)) {
            res.status(400)
            throw new Error("Enter a valid email format")
        }

        if (!validator.isStrongPassword(password)) {
            const passwordIssues = validatePassword(password);
            if (passwordIssues.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Password does not meet the required criteria',
                    errors: passwordIssues
                });
            }
        }

        const userExist = await User.findOne({ email }).lean()
        if (userExist) {
            res.status(401)
            throw new Error("User Already exist, Login or make use of another email")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            userType
        })

        await sendMail({
            _id: user._id,
            email: user.email,
            firstName: user.firstName
        })
            .then((response) => {
                res.status(200).json({ success: true, response })
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err)
            })
    }),

    // verify the user
    verifyUser: asyncHandler(async (req, res) => {

        const { otp, email } = req.body
        const userInfo = await User.findOne({ email });
        const user = await UserVerification.findOne({ userId: userInfo._id })
        if (!user) {
            throw new Error('Account does not exist or has been verified.Try Logging in')
        }

        if (user.expiresAt < new Date()) {
            await UserVerification.findByIdAndDelete(user._id)
            sendMail({
                _id: req.user,
                email: userInfo.email,
                firstName: userInfo.firstName
            })

            res.status(200).json({
                success: true,
                message: "Verification email sent again because this has expired. Check your mail"
            })
        }

        const isMatch = await bcrypt.compare(otp, user.verificationCode);
        if (!isMatch) {
            res.status(400)
            throw new Error("Wrong verification code or verification code has expired, check your email again for new code or input correct code")
        }

        userInfo.verified = true
        await userInfo.save()

        res.status(200).json({
            success: true,
            message: "User email verified successfully"
        })
    }),

    // login the user
    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400)
            throw new Error("All fields are required")
        }

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400)
            throw new Error("Invalid Login credentials")
        }

        if (user.verified === false) {
            res.status(400)
            throw new Error("Please verify you email to login")
        }
        if (user.lockUntil > new Date()) {
            res.status(400)
            throw new Error(`User account is locked try again by ${user.lockUntil.toISOString()}`)
        }
        if (user.lockUntil && user.lockUntil < new Date()) {
            user.wrongTrials = 0;
            user.lockUntil = undefined;
            await user.save();
        }

        if (user.wrongTrials >= 10) {
            user.lockUntil = new Date(Date.now() + 10 * 60 * 1000)
            await user.save()
            res.status(400);
            throw new Error("Try  to login again in the next 10 minute")
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.wrongTrials += 1;
            await user.save()
            res.status(400)
            throw new Error("Invalid Login credentials");
        }

        user.wrongTrials = 0;
        await user.save()
        const token = jwt.sign({ id: user.id, role: user.userType }, process.env.JWT_SECRET, { expiresIn: "10d" });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType
            }
        })
    }),

    // get user profile
    getUserProfile: asyncHandler(async (req, res) => {
        const user = await User.findById(req.user).select("-password").lean();
        if (!user) {
            res.status(401)
            throw new Error("User does not exist please try again")
        }

        res.status(200).json({
            success: true,
            message: "Fetched user profile successfully",
            user
        })
    })

}

module.exports = userController