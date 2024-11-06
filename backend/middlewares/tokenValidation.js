const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const tokenValidation = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        if (!token || token.split('.').length !== 3) {
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.error("JWT verification error: Token expired");
                    return res.status(401).json({ success: false, message: "Token expired, please log in again" });
                }
                console.error("JWT verification error:", err);
                return res.status(401).json({ success: false, message: "User is not authorized" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ success: false, message: "User is not authorized, no token provided" });
    }
});

module.exports = { tokenValidation };
