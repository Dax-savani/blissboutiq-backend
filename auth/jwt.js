const jwt = require('jsonwebtoken');
require("dotenv").config();

const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET_KEY );
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return null;
    }
}

module.exports = {generateToken, verifyToken}