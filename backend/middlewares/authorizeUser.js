const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log("not authorized")
            return res.status(403).json({
                success: false,
                message: "Access denied: insufficient permissions"
            });
        }
        next()

    }
}

module.exports = authorize