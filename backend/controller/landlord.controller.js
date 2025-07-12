const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");
const allFieldsRequired = require("../utils/AllFieldsRequired");
const getCoordinates = require("../utils/getCoordinate");


const landlordController = {
    createProperty: asyncHandler(async (req, res) => {
        const {
            title,
            description,
            propertyType,
            bedrooms,
            bathrooms,
            toilets,
            furnished,
            price,
            billingCycle,
            isAvailable,
        } = req.body;

        // Parse nested JSON fields from multipart/form-data
        const location = JSON.parse(req.body.location);
        const features = JSON.parse(req.body.features || "[]");
        const fees = JSON.parse(req.body.fees);


        const images = req.files?.map((file) => file.path); // Or `file.filename` depending on storage

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required.",
            });
        }

        if (
            allFieldsRequired([
                title,
                description,
                propertyType,
                price,
                billingCycle,
                location?.address,
                location?.city,
                location?.state,
                location?.country,
                isAvailable
            ])
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const propertyExist = await Property.findOne({
            title,
            landlord: req.user._id,
        });

        if (propertyExist) {
            return res.status(400).json({
                success: false,
                message: "You have already created a property with this name",
            });
        }

        const coordinates = await getCoordinates(
            location.address,
            location.city,
            location.state,
            process.env.GEO_API_KEY
        );

        if (!coordinates?.latitude || !coordinates?.longitude) {
            return res.status(400).json({
                success: false,
                message: "Could not determine coordinates from location",
            });
        }

        const locationMain = {
            address: location.address,
            city: location.city,
            state: location.state,
            country: location.country,
            coordinates: {
                coordinates: [coordinates.longitude, coordinates.latitude],
            },
        };

        const property = await Property.create({
            landlord: req.user._id,
            title,
            description,
            propertyType,
            bedrooms,
            bathrooms,
            toilets,
            furnished,
            price,
            billingCycle,
            fees: {
                agency: price * 0.02,
                caution: fees.caution,
            },
            features,
            images,
            location: locationMain,
            isAvailable,
        });

        return res.status(201).json({
            success: true,
            message: "Congratulations Property added Successfully",
            property,
        });
    }),

    getMyProperties: asyncHandler(async (req, res) => {


        // logic for implementing pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


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
        const filter = { landlord: req.user._id };
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
                message: "Property List is empty Please add to the properties",
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
            message: "Properties List fetched successfully",
            count: properties.length,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
            properties
        });
    }),

    // ! possible error with the date field if you encounter in the fronted
    // updateProperty
    updateProperty: asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Find the property and ensure ownership
        const property = await Property.findOne({ _id: id, landlord: req.user._id });
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you're not authorized to update it"
            });
        }

        // Whitelisted fields that are safe to update
        const allowedFields = {
            title: "string",
            description: "string",
            propertyType: "string",
            bedrooms: "number",
            bathrooms: "number",
            toilets: "number",
            furnished: "boolean",
            price: "number",
            billingCycle: "string",
            features: "object", // expecting array
            isAvailable: "boolean",
            availableFrom: "string"
        };

        for (const [field, expectedType] of Object.entries(allowedFields)) {
            if (req.body.hasOwnProperty(field)) {
                const value = req.body[field];

                // Check for valid type, except for null which is allowed for optional fields
                if (value !== null && typeof value !== expectedType) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid type for field '${field}'. Expected ${expectedType}`
                    });
                }

                // Special handling for price
                if (field === "price") {
                    property.price = value;
                    property.fees.agency = value * 0.02;
                } else {
                    property[field] = value;
                }
            }
        }

        // Save the updated property
        await property.save();

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
            property
        });
    }),

    // deleteProperty
    deleteProperty: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const property = await Property.findOneAndDelete({ _id: id, landlord: req.user._id });

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found or unauthorized" });
        }

        res.status(200).json({
            success: true,
            message: "Property deleted successfully"
        });
    }),

    // toggleAvailability
    toggleAvailability: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const property = await Property.findOne({ _id: id, landlord: req.user._id });

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        property.isAvailable = !property.isAvailable;
        await property.save();

        res.status(200).json({
            success: true,
            message: `Property marked as ${property.isAvailable ? "available" : "unavailable"}`,
            isAvailable: property.isAvailable
        });
    }),

    // getSingleProperty
    getSingleProperty: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const property = await Property.findOne({ _id: id, landlord: req.user._id }).populate("landlord", "firstName email lastName").lean();

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
    }),

    uploadImages: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const files = req.files; // multer puts files in req.files


        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No images uploaded. Please ensure files are attached.",
            });
        }

        const property = await Property.findOne({ _id: id, landlord: req.user._id });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you do not have access.",
            });
        }

        // Push the uploaded image URLs into property.images
        files.forEach((file) => {
            if (file.path) {
                property.images.push(file.path);
            }
        });

        await property.save();

        res.status(200).json({
            success: true,
            message: `${files.length} image(s) uploaded successfully.`,
            images: property.images,
        });
    }),

}


module.exports = landlordController