const Homigister = require("../models/home");
const cloudinary = require("cloudinary").v2;

exports.getAddhome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to Airbnb",
    currentPage: "add-home",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getedithome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Homigister.findById(homeId).then((homes) => {
    if (!homes) {
      console.log("No home");
      return res.redirect("/host/homelistpage");
    }
    res.render("host/edit-home", {
      pageTitle: "Edit Home",
      currentPage: "Host-home",
      editing: editing,
      home: homes,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Homigister.find().then((registerHome) => {
    res.render("host/homelistpage", {
      registerHome: registerHome,
      pageTitle: "Host Home List",
      currentPage: "Host-home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddhome = async (req, res, next) => {
  try {
    const { Home, Price, Location, rating, description, amenities, houseFeatures } = req.body;
    console.log("File uploaded:", req.file)
    if (!req.file) {
      return res.status(400).send("No image provided");
    }

    const home = new Homigister({
      Home,
      Price,
      Location,
      rating,
      photo: {
        url: req.file.path,        //  secure Cloudinary URL
        public_id: req.file.filename, // Cloudinary public_id
      },
      description,
      amenities,
      houseFeatures,
    });

    await home.save();
    console.log("Home added successfully");
    res.redirect("/host/homelistpage");
  } catch (err) {
    console.error("Error while adding home:", err);
    res.status(500).send("Something went wrong");
  }
};


exports.postEdithome = async (req, res, next) => {
  try {
    const { id, Home, Price, Location, rating, description, amenities, houseFeatures } = req.body;

    const home = await Homigister.findById(id);
    if (!home) {
      console.log("No home found");
      return res.redirect("/host/homelistpage");
    }

    // If new photo uploaded → replace old one
    if (req.file) {
      // Delete old photo from Cloudinary
      if (home.photo && home.photo.public_id) {
        await cloudinary.uploader.destroy(home.photo.public_id);
      }

      // Upload new photo
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "homes",
      });

      home.photo = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    home.Home = Home;
    home.Price = Price;
    home.Location = Location;
    home.rating = rating;
    home.description = description;
    home.amenities = amenities;
    home.houseFeatures = houseFeatures;

    await home.save();
    console.log("Home updated successfully");
    res.redirect("/host/homelistpage");
  } catch (err) {
    console.log("Error while updating home:", err);
    res.status(500).send("Something went wrong");
  }
};

exports.postDeletehome = async (req, res, next) => {
  const homeId = req.params.homeId;
  try {
    const home = await Homigister.findById(homeId);

    if (!home) {
      console.log("Home not found");
      return res.redirect("/host/homelistpage");
    }

    // Delete photo from Cloudinary
    if (home.photo && home.photo.public_id) {
      await cloudinary.uploader.destroy(home.photo.public_id);
    }

    // Delete from MongoDB
    await Homigister.findByIdAndDelete(homeId);

    console.log("Home and photo deleted successfully");
    res.redirect("/host/homelistpage");
  } catch (err) {
    console.log("Error deleting home:", err);
    res.status(500).send("Something went wrong");
  }
};
