const express = require("express");
const landlordController = require("../../controller/landlord.controller");
const authorize = require("../../middlewares/authorizeUser");
const isAuthenticated = require("../../middlewares/isAuth");

const propertyRouter = express.Router();

// Apply auth middleware globally
propertyRouter.use(isAuthenticated);

// ===============================
// Landlord-only routes
// ===============================

// Create new property
propertyRouter.post("/create", authorize("landlord"), landlordController.createProperty);

// Get all landlord properties
propertyRouter.get("/my", authorize("landlord"), landlordController.getMyProperties);

// Get single property (landlord view)
propertyRouter.get("/getById/:id", authorize("landlord"), landlordController.getSingleProperty);

// Update property
propertyRouter.patch("/:id", authorize("landlord"), landlordController.updateProperty);

// Delete property
propertyRouter.delete("/:id", authorize("landlord"), landlordController.deleteProperty);

// Toggle availability
propertyRouter.patch("/:id/toggle", authorize("landlord"), landlordController.toggleAvailability);

// Upload property images
propertyRouter.post("/:id/upload-images", authorize("landlord"), landlordController.uploadImages);

module.exports = propertyRouter;
