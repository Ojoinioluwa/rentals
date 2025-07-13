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
            longitude,
            latitude
        } = req.query;

        // Validate numeric inputs
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

        const parsedLat = latitude ? parseFloat(latitude) : null;
        const parsedLng = longitude ? parseFloat(longitude) : null;

        let properties = [];
        let total = 0;

        // 🔍 Use geo spatial filter if lat/lng provided and valid
        if (parsedLat !== null && parsedLng !== null && !isNaN(parsedLat) && !isNaN(parsedLng)) {
            const geoFilter = {
                ...filter,
                "location.coordinates": {
                    $geoWithin: {
                        $centerSphere: [
                            [parsedLng, parsedLat],
                            40 / 6378.1, // 15km radius
                        ],
                    },
                },
            };

            total = await Property.countDocuments(geoFilter);
            properties = await Property.find(geoFilter)
                .populate("landlord", "email firstName lastName")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        }
        // 🔎 Fallback to text-based fuzzy search
        else if (search) {
            filter.$or = [
                { city: { $regex: search, $options: "i" } },
                { state: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
            ];

            total = await Property.countDocuments(filter);
            properties = await Property.find(filter)
                .populate("landlord", "email firstName lastName")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        }
        // 🔁 No search or lat/lng — just fetch by other filters
        else {
            total = await Property.countDocuments(filter);
            properties = await Property.find(filter)
                .populate("landlord", "email firstName lastName")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        }

        return res.status(200).json({
            success: true,
            message: "Properties fetched successfully",
            count: properties.length,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
            properties,
        });
    }),

    getProperty: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const property = await Property.findOne({ _id: id }).populate("landlord", "firstName email lastName").lean();

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