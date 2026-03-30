const Booking = require("../models/booking");
const Homigister = require("../models/home");
const User = require("../models/user");

const bookingConfirmation = async (req, res, next, homeId, user) => {
const today = new Date();

  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 12); 

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
  const formattedAvailableRanges = availableRanges.map((range) => ({
    title: "Available",
    start: new Date(range.start).toISOString().split('T')[0],
    end: new Date(range.end).toISOString().split('T')[0],
    color: "green",
  }));
  let favourites = []; 
  
  if (user) {
    const dbUser = await User.findById(user._id);
    favourites = dbUser?.favourites?.map(id => id.toString()) || [];
  }
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
      favourites,
    });
  });
};
module.exports = bookingConfirmation;