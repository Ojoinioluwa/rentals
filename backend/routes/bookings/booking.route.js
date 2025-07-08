// routes/bookings.js
const express = require("express");
const authorize = require("../../middlewares/authorizeUser");
const bookController = require("../../controller/booking.controller");
const isAuthenticated = require("../../middlewares/isAuth");

const bookingRouter = express.Router();

// Apply auth middleware to all routes
bookingRouter.use(isAuthenticated);

// ============================
// Renter Routes (renter)
// ============================


// Create a booking for a property
bookingRouter.post("/:id", authorize("renter", "landlord"), bookController.createBooking);

// Get all bookings by the tenant
bookingRouter.get("/me", authorize("renter", "landlord"), bookController.getMyBookings);

// Get a single booking by the renter
bookingRouter.get("/me/:id", authorize("renter", "landlord"), bookController.getBooking);

// Cancel a booking by the renter
bookingRouter.put("/me/:id/cancel", authorize("renter"), bookController.cancelBooking);

// Reschedule a booking by the renter
bookingRouter.put("/me/:id/reschedule", authorize("renter"), bookController.rescheduleBooking);


// ============================
// Landlord Routes
// ============================

// Get all booking requests for landlord
bookingRouter.get("/landlord", authorize("landlord"), bookController.getBookingsByLandlord);

// Get single booking for landlord
bookingRouter.get("/landlord/:id", authorize("landlord"), bookController.getBookingByLandlord);

// Approve booking by landlord
bookingRouter.put("/landlord/:id/approve", authorize("landlord"), bookController.approveBooking);

// Reject booking by landlord
bookingRouter.put("/landlord/:id/reject", authorize("landlord"), bookController.rejectBooking);


module.exports = bookingRouter;
