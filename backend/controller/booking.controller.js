const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");
const Booking = require("../models/Booking");


const bookController = {
    // ============================
    // Renters controller
    // ===========================

    createBooking: asyncHandler(async (req, res) => {
        const { message, rentStart, rentEnd } = req.body
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Property Id"
            })
        }
        if (!rentStart || !rentEnd) {
            return res.status(400).json({
                success: false,
                message: "Fill in all required Fields"
            })
        }

        const property = await Property.findById(id).lean();

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property does not exist"
            })
        }

        const booking = await Booking.create({
            property: property._id,
            tenant: req.user._id,
            landlord: property.landlord,
            message,
            rentEnd,
            rentStart
        })

        res.status(201).json({
            success: true,
            message: "Booking Created successfully",
            booking
        })

    }),

    getMyBookings: asyncHandler(async (req, res) => {
        // logic for implementing pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status

        const allowedStatus = [
            "pending",
            "approved",
            "rejected",
            "cancelled"
        ]

        const filter = { tenant: req.user._id }

        if (status && allowedStatus.includes(status)) {
            filter.status = status;
        }


        const total = await Booking.countDocuments(filter)

        if (total == 0) {
            return res.status(200).json({
                success: true,
                message: "Bookings List is empty Please create bookings",
                bookings: []
            })
        }


        const bookings = await Booking.find(filter)
            .populate("property", "title description propertyType description")
            .limit(limit)
            .skip(skip)
            .lean();

        res.status(200).json({
            success: true,
            message: "Bookings Fetched Successfully",
            bookings
        })


    }),

    getBooking: asyncHandler(async (req, res) => {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Booking Id is invalid"
            })
        }

        const booking = await Booking.findOne({ tenant: req.user._id, _id: id }).populate("landlord", "firstName lastName email").populate("property", "fees price location").lean()

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking does not exist or not Authorized to view Booking"
            })
        }

        res.status(200).json({
            success: true,
            message: "Booking details fetched Successfully",
            booking
        })


    }),

    cancelBooking: asyncHandler(async (req, res) => {
        const { id } = req.params
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking does not exist or not authorized"
            })
        }

        booking.status = "cancelled"
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled Successfully",
        })

    }),

    rescheduleBooking: asyncHandler(async (req, res) => {
        const { rentStart, rentEnd } = req.body
        const { id } = req.params

        const booking = await Booking.findOne({
            _id: id,
            tenant: req.user._id,
            status: { $nin: ["cancelled", "rejected"] }
        });


        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Bookings does not exist'
            })
        }

        booking.rentStart = rentStart
        booking.rentEnd = rentEnd

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Bookings updated Successfully"
        })
    }),



    // ============================
    // landlords controller
    // ============================

    getBookingsByLandlord: asyncHandler(async (req, res) => {
        // logic for implementing pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status

        const allowedStatus = [
            "pending",
            "approved",
            "rejected",
            "cancelled"
        ]

        const filter = { landlord: req.user._id }

        if (status && allowedStatus.includes(status)) {
            filter.status = status;
        }


        const total = await Booking.countDocuments(filter)

        if (total == 0) {
            return res.status(200).json({
                success: true,
                message: "Bookings List is empty.",
                bookings: []
            })
        }


        const bookings = await Booking.find(filter)
            .populate("property", "title description propertyType description")
            .limit(limit)
            .skip(skip)
            .lean();

        res.status(200).json({
            success: true,
            message: "Bookings Fetched Successfully",
            bookings
        })
    }),

    rejectBooking: asyncHandler(async (req, res) => {
        const { id } = req.params
        const booking = await Booking.findOne({ landlord: req.user._id, _id: id });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking does not exist or not authorized"
            })
        }

        booking.status = "rejected"
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking rejected Successfully",
        })

    }),
    approveBooking: asyncHandler(async (req, res) => {
        const { id } = req.params
        const booking = await Booking.findOne({ landlord: req.user._id, _id: id });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking does not exist or not authorized"
            })
        }

        booking.status = "approved"
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking approved Successfully",
        })

    }),

    getBookingByLandlord: asyncHandler(async (req, res) => {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Booking Id is invalid"
            })
        }

        const booking = await Booking.findOne({ landlord: req.user._id, _id: id }).populate("landlord", "firstName lastName email").populate("property", "fees price location images title description").populate("tenant", "email firstName lastName").lean()

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking does not exist or not Authorized to view Booking"
            })
        }

        res.status(200).json({
            success: true,
            message: "Booking details fetched Successfully",
            booking
        })


    }),


}

module.exports = bookController