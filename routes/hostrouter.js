const express = require("express");
const hostrouter = express.Router();
const hostcontroller = require("../controllers/host");
const verifyJWT = require("../middleware/JWTverify");
const { upload } = require("../cloudinary"); // import upload middleware

// Add Home
hostrouter.get("/add-home", verifyJWT, hostcontroller.getAddhome);
hostrouter.post("/add-home", verifyJWT, upload.single("photo"), hostcontroller.postAddhome);

// Home List
hostrouter.get("/homelistpage",verifyJWT, hostcontroller.getHostHomes);

// Edit Home
hostrouter.get("/edit-home/:homeId", verifyJWT, hostcontroller.getedithome);
hostrouter.post("/edit-home", verifyJWT, upload.single("photo"), hostcontroller.postEdithome);

// Delete Home
hostrouter.post("/delete-home/:homeId", verifyJWT, hostcontroller.postDeletehome);

module.exports = hostrouter;
