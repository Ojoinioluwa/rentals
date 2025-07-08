const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");



const propertyController = {
    getAllProperties: asyncHandler(async (req, res) => {

        // logic for handling pagination
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

        const skip = (page - 1) * limit

        // Optional filters
        const isAvailable = req.query.isAvailable;
        const propertyType = req.query.propertyType;
        const numOfBedroom = req.query.numOfBedroom
        const numOfBathroom = req.query.numOfBathroom
        const numOfToilets = req.query.numOfToilets
        const isFurnished = req.query.furnished

        if (numOfBedroom && isNaN(numOfBedroom)) {
            return res.status(400).json({ success: false, message: "Invalid bedroom number" });
        }
        if (numOfBathroom && isNaN(numOfBathroom)) {
            return res.status(400).json({ success: false, message: "Invalid bathroom number" });
        }
        if (numOfToilets && isNaN(numOfToilets)) {
            return res.status(400).json({ success: false, message: "Invalid toilets number" });
        }

        // Build dynamic filter
        const filter = {};
        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable === "true";
        }
        if (isFurnished !== undefined) {
            filter.furnished = isFurnished === "true";
        }
        if (propertyType) {
            filter.propertyType = propertyType;
        }
        if (numOfBedroom) {
            filter.bedrooms = Number(numOfBedroom);
        }
        if (numOfBathroom) {
            filter.bathrooms = Number(numOfBathroom);
        }
        if (numOfToilets) {
            filter.toilets = Number(numOfToilets);
        }

        const total = await Property.countDocuments(filter)

        if (total == 0) {
            return res.status(200).json({
                success: true,
                message: "Property List is empty. No Property Available",
                properties: []
            })
        }

        const properties = await Property.find(filter)
            .populate("landlord", "email firstName lastName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            success: true,
            message: "Properties fetched successfully",
            count: properties.length,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
            properties
        });



    }),
    getProperty: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const property = await Property.findOne({ _id: id }).lean();

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Property Details fetched successfully",
            property
        });
    })
}


module.exports = propertyController