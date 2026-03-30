const User = require("../models/user");
const Homigister = require("../models/home");
const Booking = require("../models/booking");
const { check, validationResult } = require("express-validator");
const booking = require("../models/booking");
const Limiter = require("../utils/DocumentLimiter");
const bookingConfirmation = require("../utils/bookingConfirmation");

exports.getIndex = async (req, res, next) => {
  return Limiter(req, res, next, "store/index","HomieeBook", "Index");
};

exports.getHomes = async (req, res, next) => {
  return Limiter(req, res, next, "store/homelist", "Home List", "Home");
};

exports.getFavList = async (req, res, next) => {
  const user = req.user || req.session.user;
  if (!user || user.userType !== "guest") {
    return res.redirect("/");
  }

  const userId = user._id;
  const dbuser = await User.findById(userId).populate("favourites");
  res.render("store/favourite-list", {
    favHome: dbuser.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites-list",
    isLoggedIn: req.isLoggedIn,
    user: user,
  });
};

exports.toggleFavourite = async (req, res, next) => {
  const user = req.user || req.session.user;
  if (!user || user.userType !== "guest") {
    return res.redirect("/");
  }

  const homeId = req.body.homeId;
  const userId = user._id;
  const dbuser = await User.findById(userId);
  const index = dbuser.favourites.findIndex(fav => fav.toString() === homeId);
  let action = "";
  if (!dbuser.favourites.includes(homeId)) {
    action = "added";
    dbuser.favourites.push(homeId);
  }
  else if(index !== -1){
    action = "removed";
    dbuser.favourites.splice(index, 1);
  }
  await dbuser.save();
  res.json({ success: true, action });
};

exports.postRemovefromfavouritelist = async (req, res, next) => {
  const user = req.user || req.session.user;
  // console.log(user);
  if (!user || user.userType !== "guest") {
    return res.redirect("/");
  }

  const homeId = req.params.homeId;
  const userId = user._id;
  const dbuser = await User.findById(userId);

  if (dbuser.favourites.includes(homeId)) {
    dbuser.favourites = dbuser.favourites.filter(
      (fav) => fav.toString() !== homeId
    );
    await dbuser.save();
  }
  res.redirect("/favourite-list");
};

exports.getHomeDetail = async (req, res, next) => {
  const user = req.user || req.session.user;
  const homeId = req.params.homeId;
  return bookingConfirmation(req, res, next, homeId, user);
};

exports.getContact = (req, res, next) => {
  const user = req.user || req.session.user;
  res.render("store/contact", {
    pageTitle: "Contact Us",
    currentPage: "contact",
    isLoggedIn: req.isLoggedIn,
    user: user,
  });
};

exports.postContact = (req, res, next) => {
  res.redirect("/contact");
};

exports.getbookings = async (req, res, next) => {
  const user = req.user || req.session.user;
  if (!user || user.userType !== "guest") {
    return res.redirect("/");
  }
  try {
    const bookings = await Booking.find({ userId: user._id })
      .populate("houseId")
      .sort({ createdAt: -1 });

    res.render("store/bookings", {
      bookings: bookings,
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn,
      user: user,
    });
  } catch (error) {
    res.redirect("/");
  }
};

exports.postbookings = async (req, res, next) => {
  const user = req.user || req.session.user;
  if (!user || user.userType !== "guest") {
    return res.redirect("/");
  }

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect("/");
    }

    const { homeId, checkInDate, checkOutDate, numberOfGuests, totalPrice } =
      req.body;

    const bookingData = {
      houseId: homeId,
      userId: user._id,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfGuests: parseInt(numberOfGuests),
      totalPrice: parseFloat(totalPrice),
    };

    const house = await Homigister.findById(homeId);
    if (!house) {
      return res.redirect("/");
    }

    const booking = new Booking(bookingData);
    await booking.save();
    res.redirect("/bookings");
  } catch (error) {
    res.redirect("/");
  }
};
exports.getPolicy = (req, res, next) => {
  res.render("store/privacy", {
    pageTitle: "Privacy Policy",
    currentPage: "privacy",});
}
exports.getTerms = (req, res, next) => {
  res.render("store/termService", {
    pageTitle: "Terms and Conditions",
    currentPage: "terms",});
}
exports.aboutUs = (req, res, next) =>{
  res.render("store/aboutUs",{
    pageTitle: "About HomieeBook",
    currentPage: "About Us",
  });
}

// exports.SearchHome = async (req, res, next) => {
//   try {
//     const user = req.user || req.session.user;
//     if (!user || user.userType !== "guest") {
//       return res.redirect("/");
//     }

//     const Location = req.query.Location;
//     // console.log(Location);
//     let results=[];

//     if (!Location || Location.trim() === "") {
//       results = await Homigister.find();
//     } else {
//       // filter by location (case-insensitive, partial match also works)
//       results = await Homigister.find({
//         Location: new RegExp(Location, "i"),
//       });
//     }
//     // console.log(results);

//     res.render("store/homelist", {
//       registerHome: results,
//       pageTitle: "Home List",
//       currentPage: "Home",
//       isLoggedIn: req.isLoggedIn,
//       user: user,
//     });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// };
