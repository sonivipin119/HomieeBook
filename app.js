// app.js
const express = require("express");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

// Controllers & Routers
const authcontroller = require("./controllers/auth");
const storerouter = require("./routes/storerouter");
const hostrouter = require("./routes/hostrouter");
const authrouter = require("./routes/authrouter");
const { error404, error500} = require("./controllers/error");
const User = require("./models/user");
const root = require("./utils/pathutills");

// Env Vars
const DB_PATH = process.env.DB_PATH;
const PORT = process.env.PORT || 3005;
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_secret";

// Init App
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"))
// app.set("views", "views");
// Middlewares

// Helmet with custom Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);

// Your other middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes...

app.use(compression());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true })); // ✅ fixed
app.use(express.json());

// File Upload Config
// const randomString = (length) => {
//   const chars = "abcdefghijklmnopqrstuvwxyz";
//   return Array.from({ length }, () =>
//     chars.charAt(Math.floor(Math.random() * chars.length))
//   ).join("");
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, randomString(10) + "-" + file.originalname),
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// app.use(multer({ storage, fileFilter }).single("photo"));

// Static Files
app.use(express.static(path.join(root, "public")));
// app.use("/uploads", express.static(path.join(root, "uploads")));
// app.use("/host/uploads", express.static(path.join(root, "uploads")));
// app.use("/homes/uploads", express.static(path.join(root, "uploads")));

// Sessions
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Make user available in views
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user || null;
  req.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

// Google OAuth Config ✅ dynamic callback
const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://your-project-name.vercel.app/auth/google/callback"
    : "http://localhost:3005/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    authcontroller.SocialLoginVerify
  )
);
console.log("Google OAuth Callback URL:", callbackURL);
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Client ID length:", process.env.GOOGLE_CLIENT_ID.length);

console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
console.log("ClientSecret:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Missing");
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
app.use(authrouter);
app.use(storerouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/Login");
  }
});
app.use("/host", hostrouter);

// Error Handlers

// This route will throw an error intentionally
app.get('/test-500', (req, res, next) => {
  const error = new Error("This is a test server error!");
  next(error); // Pass the error to the error handling middleware
});
// console.error("500 handler triggered:", err);
app.use(error404);
app.use(error500);

// MongoDB Connection
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () =>
        console.log(`🚀 Server running at http://localhost:${PORT}`)
      );
    }
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

module.exports = app;
