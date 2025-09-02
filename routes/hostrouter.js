const express = require("express");
const hostrouter = express.Router();
const hostcontroller = require("../controllers/host");
const { upload } = require("../cloudinary"); // import upload middleware

// Add Home
hostrouter.get("/add-home", hostcontroller.getAddhome);
hostrouter.post("/add-home", upload.single("photo"), hostcontroller.postAddhome);

// Home List
hostrouter.get("/homelistpage", hostcontroller.getHostHomes);

// Edit Home
hostrouter.get("/edit-home/:homeId", hostcontroller.getedithome);
hostrouter.post("/edit-home", upload.single("photo"), hostcontroller.postEdithome);

// Delete Home
hostrouter.post("/delete-home/:homeId", hostcontroller.postDeletehome);

module.exports = hostrouter;
