const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");
const getCoordinates = require("../utils/getCoordinate");



const propertyController = {
    getAllProperties: asyncHandler(async (req, res) => {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
        const skip = (page - 1) * limit;

        const {
            isAvailable,
            propertyType,
            numOfBedroom,
            numOfBathroom,
            numOfToilets,
            furnished,
            search,
        } = req.query;

        // Validate inputs
        if (numOfBedroom && isNaN(numOfBedroom))
            return res.status(400).json({ success: false, message: "Invalid bedroom number" });

        if (numOfBathroom && isNaN(numOfBathroom))
            return res.status(400).json({ success: false, message: "Invalid bathroom number" });

        if (numOfToilets && isNaN(numOfToilets))
            return res.status(400).json({ success: false, message: "Invalid toilets number" });

        const filter = {};

        if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
        if (furnished !== undefined) filter.furnished = furnished === "true";
        if (propertyType) filter.propertyType = propertyType;
        if (numOfBedroom) filter.bedrooms = Number(numOfBedroom);
        if (numOfBathroom) filter.bathrooms = Number(numOfBathroom);
        if (numOfToilets) filter.toilets = Number(numOfToilets);

        // Add fuzzy search on location fields
        if (search) {
            filter.$or = [
                { city: { $regex: search, $options: "i" } },
                { state: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
            ];
        }

        let total = await Property.countDocuments(filter);
        let properties = await Property.find(filter)
            .populate("landlord", "email firstName lastName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Fallback logic: If no match, try nearby locations
        // let suggestedProperties = [];

        // if (properties.length === 0 && search) {
        //     const geoData = await getCoordinates(search, process.env.GEO_API_KEY); // You already have this util

        //     if (geoData) {
        //         suggestedProperties = await Property.aggregate([
        //             {
        //                 $geoNear: {
        //                     near: {
        //                         type: "Point",
        //                         coordinates: [geoData.longitude, geoData.latitude],
        //                     },
        //                     distanceField: "distance",
        //                     maxDistance: 15000, // 15 km range
        //                     spherical: true,
        //                     key: "location.coordinates", // Adjust if your schema differs
        //                 },
        //             },
        //             { $limit: 10 },
        //         ]);
        //     }
        // }

        return res.status(200).json({
            success: true,
            message: "Properties fetched successfully",
            count: properties.length,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
            properties,
            // suggestedProperties,
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