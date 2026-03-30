// utils/jwt.js
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "Jwt_secret_key_here";

// 🔑 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      userType: user.userType, 
    },
    secretKey,
    { expiresIn: "1h" }
  );
};

// 🔍 Verify Token
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  generateToken,
  verifyToken,
};