const user = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const generateToken = require('../services/generateToken');
const jwt = require('jsonwebtoken');


const createUser = async (req, res) => {
    console.log("registration");
    const { name, email, password, deviceId } = req.body;
    try {
        const isEmptykey = Object.keys(req.body).some(key => {
            const value = req.body[key]
            return value === '' || value === null || value === undefined;
        })
        if (isEmptykey) {
            return res.status(400).json({
                success: false,
                message: "please do not give empty fields"
            })
        }
        const existingUser = await user.findOne({
            where: {
                email: email
            }
        })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "user is already exist"
            })
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const creatingUser = await user.create({
            name: name,
            email: email,
            password: hashedpassword,
            deviceId: deviceId
        })

       
        await creatingUser.save()

        if (creatingUser) {
            return res.status(200).json({
                success: true,
                message: "user registration successfully.",
                data: creatingUser
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "User not created"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,

        })
    }
}

const loginUser = async (req, res) => {
    console.log("login");
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({
            where: {
                email: email
            }
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        const access_token = generateToken.generateAccessToken(existingUser);
        const refresh_token = generateToken.generateRefreshToken();
        existingUser.refreshToken = refresh_token;
        await existingUser.save();
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true
        });
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: existingUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const isLogged = async (req, res) => {
    try {
      
        // Extract the access token from the request cookies
        const accessToken = req.cookies.access_token;

        // Check if the access token exists
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token not found"
            });
        }
       

        // Verify the access token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token"
                });
            } else {
                // Access token is valid, find the user by ID
                const foundUser = await user.findOne({
                    where: {
                        id: decoded.id
                    }
                });
                if (!foundUser) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                } else {
                    // User is logged in, return user information
                    return res.status(200).json({
                        success: true,
                        message: "User is logged in",
                        data: foundUser
                    });
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const sessionMiddleware = async (req, res, next) => {
    try {
        // Extract the access token from the request cookies
        const accessToken = req.cookies.access_token;

        // Check if the access token exists
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token not found"
            });
        }

        // Verify the access token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token"
                });
            } else {
                // Access token is valid, find the user by ID
                const foundUser = await user.findOne({
                    where: {
                        id: decoded.id
                    }
                });
                if (!foundUser) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                } else {
                    // Check if the active session matches the current session
                    if (req.cookies.sessionId !== foundUser.activeSession) {
                        // Invalidate existing session
                        // Perform logout actions
                        foundUser.activeSession = null; // Clear active session in user object
                        // Remove session identifier from database or session store
                        // Redirect to login or send appropriate response
                        return res.status(401).json({ success: false, message: "You are logged in on another system." });
                    }
                }
            }
        });
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const logout = async (req, res) => {    
    // req.user.activeSession = null; 

    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    // Send response
    return res.json({ success: true, message: "Logout successful" });
}


const authenticateMiddleware = async (req, res, next) => {
    try {
        // Extract the access token from the request headers
        const accessToken = req.headers.authorization && req.headers.authorization.split(' ')[1];

        // Check if the access token exists
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token not found"
            });
        }

        // Verify the access token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token"
                });
            } else {
                // Access token is valid, find the user by ID
                const foundUser = await user.findOne({
                    where: {
                        id: decoded.id
                    }
                });
                if (!foundUser) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                } else {
                    // Attach the authenticated user to the request object
                    req.user = foundUser;
                    next(); // Proceed to the next middleware or route handler
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    isLogged,
    sessionMiddleware,
    logout,
    authenticateMiddleware
}