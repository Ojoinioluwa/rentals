const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    propertyType: {
        type: String,
        enum: ["apartment", "self-contain", "duplex", "shop", "office", "room", "studio"],
        required: true,
    },
    bedrooms: {
        type: Number,
        default: 0,
    },

    bathrooms: {
        type: Number,
        default: 0,
    },

    toilets: {
        type: Number,
        default: 0,
    },

    furnished: {
        type: Boolean,
        default: false,
    },

    price: {
        type: Number,
        required: true,
    },

    billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
        required: true,
        default: "yearly"
    },

    fees: {
        agency: { type: Number, default: 0 },
        caution: { type: Number, default: 0 },
    },

    features: {
        type: [String], // ["water", "electricity", "parking", ...]
        default: [],
    },

    images: {
        type: [String], // store Cloudinary or Firebase URLs
        validate: [arr => arr.length > 0, "At least one image is required"]
    },

    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },

    availableFrom: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add a 2dsphere index for location-based queries
propertySchema.index({ "location.coordinates": "2dsphere" });

propertySchema.virtual("totalPrice").get(function () {
    return this.price + (this.fees?.agency || 0) + (this.fees?.caution || 0)
})

module.exports = mongoose.model("Property", propertySchema);
