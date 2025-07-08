const express = require("express");
const propertyController = require("../../controller/property.controller");

const publicPropertyRouter = express.Router();

// ===============================
// Public Routes (No Auth Required)
// ===============================

// List all properties
publicPropertyRouter.get("/", propertyController.getAllProperties);

// Get single property by ID
publicPropertyRouter.get("/:id", propertyController.getProperty);

module.exports = publicPropertyRouter;
