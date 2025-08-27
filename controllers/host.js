
const Homigister = require("../models/home");
const fs = require("fs");

exports.getAddhome = (req, res, next) => {
  res.render("host/edit-home",{pageTitle:"Add Home to Airbnb",currentPage : 'add-home',
    editing : false,
    isLoggedIn : req.isLoggedIn,
    user : req.session.user,
  });
}
exports.getedithome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Homigister.findById(homeId).then(homes=>{
    if(!homes){
      console.log("No home");
      res.redirect("/host/homelistpage");
    }
    console.log(homeId, editing, homes);
    res.render("host/edit-home",{pageTitle:"Edit Home",currentPage : 'Host-home',
      editing : editing,
      home : homes,
      isLoggedIn : req.isLoggedIn,
      user : req.session.user,
    });
  })
}
exports.getHostHomes = (req, res, next) => {
  Homigister.find().then(registerHome =>{
    res.render("host/homelistpage", { 
      registerHome: registerHome ,
      pageTitle : "Host Home List",
      currentPage:'Host-home',
      isLoggedIn : req.isLoggedIn,
      user : req.session.user,
    })
});
};
exports.postAddhome = (req, res, next) => {
  const {Home, Price, Location, rating, description, amenities,houseFeatures} = req.body;
  console.log(req.file);
  if(!req.file){
    return res.status(400).send("No image provided");
  }
  const photo = req.file.path;
  const home = new Homigister({Home, Price, Location, rating, photo,description, amenities, houseFeatures});
  home.save().then(()=>{
    console.log("Home saved successfully");
  });
  
  res.redirect("/host/homelistpage");
  
}
exports.postEdithome = (req, res, next) => {
  const {id, Home, Price, Location, rating,description, amenities, houseFeatures} = req.body;
  // let amenities = req.body.amenities;
  // if (!amenities) {
  //   amenities = [];
  // } else if (!Array.isArray(amenities)) {
  //   amenities = [amenities];
  // }
  Homigister.findById(id).then((home) =>{
    
    if(!home){
      console.log("No home found");
      return;
    }
    home.Home = Home;
    home.Price = Price;
    home.Location = Location;
    home.rating = rating;
    if(req.file){
      fs.unlink(home.photo, (err)=>{
        if(err){
          console.log("error while deleting",err);
        }
      })
      home.photo = req.file.path;
    }
    home.description = description;
    home.amenities = amenities;
    home.houseFeatures = houseFeatures;
    home.save().then((result)=>{
      console.log("Home updated successfully",result);
    });
    res.redirect("/host/homelistpage");
  }).catch(err=>{
    console.log("error while updating",err);
  })
  .catch((err)=>{
    console.log("error while updating",err);
  })
  
  
}
exports.postDeletehome = (req, res, next) => {
  const homeId = req.params.homeId;
  Homigister.findByIdAndDelete(homeId).then(()=>{
  res.redirect("/host/homelistpage");
  }).catch(err=>{
    console.log(err);
  });
}


