require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const errorhandler = require("./middlewares/errorHandler");
const userRouter = require("./routes/user/userRouter");
const limiter = require("./middlewares/rateLimiter");
const helmet = require('helmet');
const bookingRouter = require("./routes/bookings/booking.route");
const propertyRouter = require("./routes/landlord/landlord.route");
const publicPropertyRouter = require("./routes/properties/properties.route");
const { getCoordinatesFromLocation } = require("./app");

const app = express();
const PORT = process.env.PORT || 8000

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDb connected successfully")
    })
    .catch((err) => {
        console.log("error connecting to the database")
        console.log(err)
    })

// apply to all routes
app.use(express.json());
app.use(limiter)
app.use(helmet());

// consume the routes
app.use("/api/v1", userRouter)
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/properties/landlord", propertyRouter);
app.use("/api/v1/properties", publicPropertyRouter);



// consume the errorhandler middleware
app.use(errorhandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})