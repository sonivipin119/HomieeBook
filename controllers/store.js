const User = require("../models/user");
const Homigister = require("../models/home");
const Booking = require("../models/booking");
const { check, validationResult } = require("express-validator");
const booking = require("../models/booking");

exports.getIndex = (req, res, next) => {
  const user = req.user || req.session.user;
  Homigister.find().then((registerHome) => {
    res.render("store/index", {
      registerHome: registerHome,
      pageTitle: "HomieeBook",
      currentPage: "Index",
      isLoggedIn: req.isLoggedIn,
      user: user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  const user = req.user || req.session.user;
  Homigister.find().then((registerHome) => {
    res.render("store/homelist", {
      registerHome: registerHome,
      pageTitle: "Home List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: user,
    });
  });
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

exports.postaddtofavouritelist = async (req, res, next) => {
  const user = req.user || req.session.user;
  if (!user || user.userType !== "guest") {
    return res.redirect("/");
  }

  const homeId = req.body.homeId;
  const userId = user._id;
  const dbuser = await User.findById(userId);
  if (!dbuser.favourites.includes(homeId)) {
    dbuser.favourites.push(homeId);
    await dbuser.save();
  }
  res.redirect("/favourite-list");
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
   
 
  const today = new Date();// Set to start of today

  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 12); // 1 month lookahead

  // Get only bookings for this home, sorted ASC
  const allBookings = await Booking.find({ houseId: homeId }).sort({
    checkInDate: 1,
  });


  // Filter out past bookings (checkout before today)
  const bookings = allBookings.filter((b) => new Date(b.checkOutDate) >= today);

  let availableRanges = [];
  let availableStart = new Date(today); // start availability from today, not past
  // console.log("availableStart in outer for:", availableStart);
  //resolve timezone issues not give previous date
  for (const booking of bookings) {
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);

    // Case 1: Gap before a booking
    if (availableStart < checkInDate) {
      // console.log("availableStart:", availableStart);
      availableRanges.push({
        start: new Date(availableStart),
        end: new Date(checkInDate),
      });
    }

    // Move availableStart to day after checkout
    availableStart = new Date(checkOutDate);
    availableStart.setDate(availableStart.getDate() + 1);
  }

  // Case 2: Availability after last booking
  if (availableStart < nextDate) {
    availableRanges.push({
      start: new Date(availableStart),
      end: new Date(nextDate),
    });
  }
  // console.log("Server Timezone Offset (minutes):", new Date().getTimezoneOffset());

  // Format bookings for calendar (red)
  const formattedBookings = bookings.map((booking) => {
    const checkOutPlusOne = new Date(booking.checkOutDate);
    checkOutPlusOne.setDate(checkOutPlusOne.getDate() + 1);
    // Ensure check-in date is not in the past
    if (booking.checkInDate < today) {
      booking.checkInDate = today;
    }
    return {
      title: "Booked",
      start: new Date(booking.checkInDate).toISOString().split('T')[0],
      end: checkOutPlusOne.toISOString().split('T')[0],
      color: "red",
    };
  });
  // console.log("availableRanges:", availableRanges);
  // Format available ranges (green)
  const formattedAvailableRanges = availableRanges.map((range) => ({
    title: "Available",
    start: new Date(range.start).toISOString().split('T')[0],
    end: new Date(range.end).toISOString().split('T')[0],
    color: "green",
  }));

  Homigister.findById(homeId).then((homes) => {
    if (!homes) {
      return res.redirect("/");
    }
    res.render("store/home-detail", {
      pageTitle: homes.Home,
      currentPage: "home-detail",
      home: homes,
      isLoggedIn: req.isLoggedIn,
      host: {
        name: "John Doe",
        joinedDate: "January 2020",
        responseRate: "95%",
        responseTime: "within an hour",
      },
      reviews: [
        { user: "Alice", rating: 5, comment: "Great place!" },
        {
          user: "Bob",
          rating: 4,
          comment: "Very comfortable, but a bit noisy.",
        },
      ],
      bookings: formattedBookings,
      availableRanges: formattedAvailableRanges,
      user: user,
    });
  });
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