const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "Jwt_secret_key_here";
const User = require("../models/user");
const verifyJWT = async(req, res, next) => {
  try {
    const token = req.cookies.token;

    // allow session fallback
    if (!token && req.session?.isLoggedIn) {
      return next();
    }

    if (!token) return res.redirect("/Login");

    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded._id);
    // console.log("User from DB:", user);
    if (!user) return res.redirect("/Login");

    req.user = user;

    res.locals.user = user;

    next();
  } catch (err) {
    return res.redirect("/Login");
  }
};
module.exports = verifyJWT;