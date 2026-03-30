const User = require("../models/user");
const Homigister = require("../models/home");

const Limiter = async(req, res, next, path, title, curpg) => {
try {
    const user = req.user || req.session.user;

    // Query params
    const Location = req.query.Location || "";
    const page = parseInt(req.query.page)  || 1;   // current page
    const limit = parseInt(req.query.limit)  || 8; // items per page

    //  Build query filter
    let filter = {};
    if (Location.trim() !== "") {
      filter.Location = new RegExp(Location, "i"); // case-insensitive search
    }

    //  Fetch paginated data
    const results = await Homigister.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    //  Get total count (for pagination UI)
    const totalHomes = await Homigister.countDocuments(filter);

    res.render(path, {
      registerHome: results,
      pageTitle: title,
      currentPage: curpg,
      isLoggedIn: req.isLoggedIn,
      user: user,
      Location: Location,
      currentPageNum: page,                  // send page number
      totalPages: Math.ceil(totalHomes / limit), // send total pages
      totalHomes: totalHomes
    }); 
  } catch (err) {
    console.error(err);
    next(err);
  }

};
module.exports = Limiter;