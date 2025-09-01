const express = require("express");
const path = require("path");
const multer = require('multer');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const DB_PATH = process.env.DB_PATH;
const authcontroller = require("./controllers/auth");
const passport = require('passport');
const GoogleStartegy = require("passport-google-oauth20").Strategy;
const storerouter = require("./routes/storerouter");
const Hostrouter = require("./routes/hostrouter");
const authrouter = require("./routes/authrouter")
const root = require("./utils/pathutills");
const User = require("./models/user");
const { error404,error500 } = require("./controllers/error");
const {default : mongoose} = require('mongoose');
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use((req, res, next) => {
  next();
});
const store = new mongodbStore({
  uri : DB_PATH,
  collection : 'session'
})

const randomString = (lenght)=>{
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for(let i = 0; i < lenght; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
      destination: (req, file, cb) =>{
        cb(null, 'uploads/');
      } ,
      filename: ( req, file, cb) =>{
        cb(null, randomString(10) + '-' + file.originalname);
     }
      
  });
  const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
      cb(null, true);
    }
    else{
      cb(null, false);
    }
  }
const multerOpt = {
 storage,fileFilter,
};
app.use(helmet());       // secure headers
app.use(compression()); 
app.use(morgan("combined"));
app.use(express.urlencoded());
app.use(multer(multerOpt).single('photo'));

app.use(express.static(path.join(root, "public")));

app.use("/uploads", express.static(path.join(root, 'uploads')));
app.use("/host/uploads", express.static(path.join(root, 'uploads')));
app.use("/homes/uploads", express.static(path.join(root, 'uploads')));

app.use(session({
  secret : "vipin soni guru",
  resave : false,
  saveUninitialized : false,
  store
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user || null;
  next();
});
app.use((req,res,next)=>{
  req.isLoggedIn = req.session.isLoggedIn || false;
  next();

});
passport.use(new GoogleStartegy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3005/auth/google/callback',
},authcontroller.SocialLoginVerify
));
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(authrouter);
app.use(storerouter);
app.use("/host",(req, res, next)=>{ 
  if(req.isLoggedIn){
    next();
  }
  else{
    res.redirect("/Login");
  }
});

app.use("/host",Hostrouter);


app.use(error404);
app.use(error500);
const PORT = process.env.PORT || 3005;




mongoose.connect(DB_PATH)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch(err => {
    console.error(" Error while connecting to MongoDB:", err);
  });

module.exports = app;
