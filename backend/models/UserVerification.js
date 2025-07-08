const mongoose = require("mongoose");

const userVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    verificationCode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
},
{timestamps: true}
)

module.exports = mongoose.model("UserVerification", userVerificationSchema)