const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending"
    },
    rentStart: {
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
                return date.getTime() > Date.now();
            },
            message: "Rent start date ({VALUE}) must be in the future"
        }
    },
    rentEnd: {
        type: Date,
        required: true,
        validate: [
            {
                validator: function (date) {
                    return this.rentStart && date.getTime() > this.rentStart.getTime();
                },
                message: "Rent end date ({VALUE}) must be after rent start date"
            },
            {
                validator: function (date) {
                    return date.getTime() > Date.now();
                },
                message: "Rent end date ({VALUE}) must be in the future"
            }
        ]
    },
    isPaid: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
);



module.exports = mongoose.model("Booking", bookingSchema);
