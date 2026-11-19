
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get JWT from HTTP-only cookie
        const token = req.cookies?.token;

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "Access denied. Please log in."
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach user information to request
        req.user = decoded;

        // Continue to next middleware or route
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
