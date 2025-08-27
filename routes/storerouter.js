
const express = require("express");
const storerouter = express.Router();
const storecontroller= require("../controllers/store");

storerouter.get("/",storecontroller.getIndex);
storerouter.get("/homes",storecontroller.getHomes);
storerouter.get("/favourite-list",storecontroller.getFavList);
storerouter.get("/homes/:homeId",storecontroller.getHomeDetail);
storerouter.post("/favourite-list",storecontroller.postaddtofavouritelist);
storerouter.post("/favoruites/delete/:homeId",storecontroller.postRemovefromfavouritelist);
storerouter.get("/contact",storecontroller.getContact);
storerouter.post("/contact",storecontroller.postContact);
storerouter.get("/bookings", storecontroller.getbookings);
storerouter.post("/bookings", storecontroller.postbookings);
storerouter.get("/privacy",storecontroller.getPolicy);
storerouter.get("/termService",storecontroller.getTerms);
module.exports = storerouter;
