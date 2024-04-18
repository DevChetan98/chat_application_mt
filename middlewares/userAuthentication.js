const jwt = require('jsonwebtoken');
const user = require("../models/userSchema");
const generateToken = require("../services/generateToken");
const refreshSecretkey = "jsonweb123";

exports.generate_access_token = async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token
        if (!refresh_token) {
            return res.status(401).json({
                success: false,
                message: "Access token expired, refresh token not found ",
            })
        }
        const decodedRefreshToken = jwt.verify(refresh_token, refreshSecretkey)
        const User = await user.findOne({ where: { refreshToken: refresh_token } })
        if (!User || !decodedRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            })
        }
        const access_token_new = generateToken.generateAccessToken(User)
        return res.status(200).json({
            access_token: access_token_new
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

