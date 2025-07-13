const express = require("express");
const userController = require("../../controller/user.controller");
const authLimiter = require("../../middlewares/authLimiter");
const isAuthenticated = require("../../middlewares/isAuth");

const userRouter = express.Router();

// Auth
userRouter.post("/auth/register", userController.register);
userRouter.post("/auth/login", authLimiter, userController.login);
userRouter.post("/auth/verify-user", userController.verifyUser);

// Password Recovery
userRouter.post("/auth/forgot-password", userController.forgotPassword);
userRouter.post("/auth/reset-password", userController.resetPassword);
userRouter.put("/auth/change-password", isAuthenticated, userController.changePassword);

// Profile
userRouter.get("/profile", isAuthenticated, userController.getUserProfile);
userRouter.put("/profile", isAuthenticated, userController.updateProfile);

module.exports = userRouter;
