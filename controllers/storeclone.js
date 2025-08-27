const User = require("../models/user");
const Homigister = require("../models/home");
const Booking = require("../models/booking");

exports.getIndex = (req, res, next) => {
  console.log("Session value :", req.session);
  
  // // If user is logged in, redirect based on their type
  // if (req.session.isLoggedIn) {
  //   if (req.session.user.userType === 'host') {
  //     return res.redirect("/host/homelistpage");
  //   } else {
  //     return res.redirect("/homes");
  //   }
  // }

  // If not logged in, show the index page
  Homigister.find().then(registerHome =>{
    res.render("store/index", { 
      registerHome: registerHome,
      pageTitle : "Airbnb Home",
      currentPage:'Index',
      isLoggedIn : req.isLoggedIn,
      user : req.session.user,
    })
  })
};
exports.getHomes = (req, res, next) => {
  Homigister.find().then(registerHome =>{
    res.render("store/homelist", { 
      registerHome: registerHome ,
      pageTitle : "Home List",
      currentPage:'Home',
      isLoggedIn : req.isLoggedIn,
      user : req.session.user,
    })
});
};
exports.getFavList  = async (req, res, next) => {
  if (req.session.user.userType !== 'guest') {
    return res.redirect("/");
  }
  
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", { 
    favHome: user.favourites ,
    pageTitle : "My Favourites",
    currentPage:'favourites-list',
    isLoggedIn : req.isLoggedIn,
    user : req.session.user,
  })
  
}


exports.postaddtofavouritelist = async(req, res, next) => {
  if (req.session.user.userType !== 'guest') {
    return res.redirect("/");
  }
  
  const homeId = req.body.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(!user.favourites.includes(homeId)){
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourite-list");
};
exports.postRemovefromfavouritelist = async(req, res, next) => {
  if (req.session.user.userType !== 'guest') {
    return res.redirect("/");
  }
  
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(user.favourites.includes(homeId)){
    user.favourites = user.favourites.filter(fav => fav.toString() !== homeId);
    await user.save();
  }
  res.redirect("/favourite-list");
}
exports.getHomeDetail = (req, res, next) => {
    const homeId = req.params.homeId; 
    Homigister.findById(homeId).then(homes => {
      if (!homes) {
        return res.redirect('/'); 
      }
      res.render("store/home-detail", { 
        pageTitle: homes.Home,
        currentPage: 'home-detail',
        home: homes,
        isLoggedIn : req.isLoggedIn,
        amenities: [
          "Wi-Fi", "Air Conditioning", "Kitchen", "Washer", "Dryer", "TV", "Pool"
        ],
        host: {
          name: "John Doe",
          joinedDate: "January 2020",
          responseRate: "95%",
          responseTime: "within an hour"
        },
        reviews: [
          { user: "Alice", rating: 5, comment: "Great place!" },
          { user: "Bob", rating: 4, comment: "Very comfortable, but a bit noisy." }
        ],
        availableDates: [
          { start: "2023-08-01", end: "2023-08-15" },
          { start: "2023-09-01", end: "2023-09-30" }
        ],
        user : req.session.user,
      });
      
      
    });
  };
  exports.getContact= (req, res, next) => {
    res.render("store/contact",{
      pageTitle: "Contact Us",
      currentPage : "contact",
      isLoggedIn : req.isLoggedIn,
      user : req.session.user,
    })
  }
  exports.postContact = (req, res, next) => {
    console.log(req.body);
    res.redirect("/contact");
  }
  exports.getbookings = async(req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    try {
      const bookings = await Booking.find({userId: req.session.user._id})
        .populate('houseId')
        .sort({createdAt: -1});
      
      res.render("store/bookings", {
        bookings: bookings, 
        pageTitle: "My Bookings",
        currentPage: 'bookings',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.redirect('/');
    }
  };
  exports.postbookings = async(req, res, next) => {
    if (!req.session.user) {
      console.log('No user session found');
      return res.redirect('/login');
    }

    try {
      console.log('Booking request body:', req.body);
      console.log('User ID:', req.session.user._id);
      
      const { homeId, checkInDate, checkOutDate, numberOfGuests, totalPrice } = req.body;
      
      // Validate required fields
      if (!homeId || !checkInDate || !checkOutDate || !numberOfGuests || !totalPrice) {
        console.log('Missing required fields:', { homeId, checkInDate, checkOutDate, numberOfGuests, totalPrice });
        return res.redirect('/');
      }

      // Convert dates to proper Date objects
      const bookingData = {
        houseId: homeId,
        userId: req.session.user._id,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numberOfGuests: parseInt(numberOfGuests),
        totalPrice: parseFloat(totalPrice)
      };

      console.log('Creating booking with data:', bookingData);
      
      // Verify the house exists
      const house = await Homigister.findById(homeId);
      if (!house) {
        console.log('House not found with ID:', homeId);
        return res.redirect('/');
      }
      console.log('Found house:', house);

      const booking = new Booking(bookingData);
      console.log('Booking object created:', booking);
      
      await booking.save();
      console.log('Booking saved successfully');
      
      // Verify the booking was saved
      const savedBooking = await Booking.findById(booking._id).populate('houseId');
      console.log('Retrieved saved booking:', savedBooking);
      
      res.redirect('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.name === 'ValidationError') {
        console.error('Validation errors:', Object.values(error.errors).map(err => err.message));
      }
      res.redirect('/');
    }
  }