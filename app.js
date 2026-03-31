// app.js
const express = require("express");
const path = require("path");
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
const { error404, error500 } = require("./controllers/error");
const verifyJWT = require("./middleware/JWTverify");

const User = require("./models/user");
const { cookie } = require("express-validator");
const cookieParser = require("cookie-parser");

// Env Vars
const DB_PATH = process.env.DB_PATH;
const PORT = process.env.PORT || 3005;
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_secret";

// Init App
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve Static Files
app.use(express.static(path.join(__dirname, "public"))); // Only one static folder
app.use(cookieParser());
// Helmet + CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net", 
          "https://*.razorpay.com", // ✅ ADD THIS
          "https://checkout.razorpay.com",
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
        ],

        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
        ],

        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://*.razorpay.com" // ✅ optional safe add
        ],

        connectSrc: [
          "'self'",
          "https://api.emailjs.com",
          "https://api.razorpay.com",
          "https://lumberjack.razorpay.com",
          "https://*.razorpay.com"
        ],

        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "data:",
        ],

        objectSrc: ["'none'"],

        frameSrc: [
          "'self'",
          "https://*.razorpay.com" // ✅ ADD THIS
        ],
      },
    },
  })
);

// Middlewares
app.use(compression());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// Google OAuth Config
const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://homiee-book-9a2u.vercel.app/auth/google/callback"
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
app.use("/api/payment", require("./routes/paymentRoutes"));
// Host routes with authentication
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/Login");
  }
});
app.use("/host", hostrouter);

// Test route for 500
app.get("/test-500", (req, res, next) => {
  const error = new Error("This is a test server error!");
  next(error);
});

// Error Handlers
app.use(error404);
app.use(error500);

// MongoDB Connection
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () =>
        console.log(`🚀 Server running at http://localhost:${PORT}`)
      );
    }
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

module.exports = app;
