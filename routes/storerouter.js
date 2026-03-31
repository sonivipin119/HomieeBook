
const express = require("express");
const storerouter = express.Router();
const storecontroller= require("../controllers/store");
const  verifyJWT = require("../middleware/JWTverify");

storerouter.get("/", storecontroller.getIndex);
storerouter.get("/homes",verifyJWT, storecontroller.getHomes);
// storerouter.get("/homes", storecontroller.SearchHome);
storerouter.get("/favourite-list",verifyJWT, storecontroller.getFavList);
storerouter.get("/homes/:homeId",verifyJWT, storecontroller.getHomeDetail);
<<<<<<< HEAD
storerouter.post("/favourite-list",verifyJWT, storecontroller.toggleFavourite);
storerouter.post("/favourites/delete/:homeId",verifyJWT, storecontroller.postRemovefromfavouritelist);
=======
storerouter.post("/favourite-list",verifyJWT, storecontroller.postaddtofavouritelist);
storerouter.post("/favoruites/delete/:homeId",verifyJWT, storecontroller.postRemovefromfavouritelist);
>>>>>>> refs/remotes/origin/homieebook
storerouter.get("/contact",verifyJWT, storecontroller.getContact);
storerouter.post("/contact",verifyJWT, storecontroller.postContact);
storerouter.get("/bookings", verifyJWT, storecontroller.getbookings);
storerouter.post("/bookings", verifyJWT, storecontroller.postbookings);
storerouter.get("/privacy",storecontroller.getPolicy);
storerouter.get("/termService",storecontroller.getTerms);
storerouter.get("/aboutUs",storecontroller.aboutUs);

module.exports = storerouter;
