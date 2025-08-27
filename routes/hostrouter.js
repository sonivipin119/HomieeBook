const express = require("express");
const hostrouter = express.Router();
const hostcontroller = require("../controllers/host");

hostrouter.get("/add-home", hostcontroller.getAddhome);

hostrouter.get("/homelistpage", hostcontroller.getHostHomes);
hostrouter.post("/add-home", hostcontroller.postAddhome);
hostrouter.get("/edit-home/:homeId", hostcontroller.getedithome);
hostrouter.post("/edit-home", hostcontroller.postEdithome);
hostrouter.post("/delete-home/:homeId", hostcontroller.postDeletehome);
module.exports = hostrouter;

