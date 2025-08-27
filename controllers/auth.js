const { check , validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getLogin = (req, res, next) => {
  res.render("auth/loginpage",
    {pageTitle:"Login",
    currentPage : "Login",
    isLoggedIn : false,
    errors : [],
    oldInput : {email : "", UserName : ""},
    user : {},
  });
}
exports.getsignUp = (req, res, next) => {
  res.render("auth/signUp",
    {pageTitle:"SignUp",
    currentPage : "signup",
    isLoggedIn : false,
    errors : [],
    oldInput : {FirstName : "", LastName : "", UserName : "", email : "", userType : "", terms : ""},
    user : {},
  });
}

exports.postsignUp = [
  check("FirstName")
  .trim().isLength({min : 3})
  .withMessage("First Name Should be atleast 3 characters long")
  .matches(/^[A-Za-z]+$/)
  .withMessage("First Name Should contain only alphabets"),
  
  check("LastName")
  .matches(/^[A-Za-z]*$/)
  .withMessage("Last Name Should contain only alphabets"),

  check("UserName")
  .trim().isLength({min : 3})
  .withMessage("User Name Should be atleast 3 characters long")
  .matches(/^[A-Za-z0-9]+$/)
  .withMessage("User Name Should contain only alphabets and numbers"),



  check("email")
  .isEmail()
  .withMessage("Enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min : 8})
  .withMessage("Password Should be atleast 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password Should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password Should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password Should contain atleast one number")
  .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
  .withMessage("Password Should contain atleast one special character")
  .trim(),
  
  check("Conpassword")
  .trim()
  .custom((value ,{req})=>{
    if(value !== req.body.password){
      throw new Error("Password and Confirm Password do not match");
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(["guest","host"])
  .withMessage("Invalid user type"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom((value, {req})=>{
    if(value !== "on"){
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),
  

  (req, res, next) => {
  const {FirstName, LastName, UserName, email, password, userType} = req.body;
  const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render("auth/signUp",{
        pageTitle : "SignUp",
        currentPage : "signup",
        isLoggedIn : false,
        errors : errors.array().map(err => err.msg),
        oldInput : {FirstName, LastName,UserName, email, userType},
        user : {},
      });
    }

    // now saving the password in hashed format 
    bcrypt.hash(password, 12).then(hashedPassword =>{
      //hashed the password 12 times
      const user = new User({FirstName,LastName,email,UserName,password : hashedPassword,userType,});
      return user.save();
    }).then(()=>{
      res.redirect("/login");
    }).catch(err =>{
      let errorMessage = err.message;
      if (err.code === 11000) {
        if (err.keyPattern.UserName) {
          errorMessage = "Username already exists.";
        } else if (err.keyPattern.email) {
          errorMessage = "Email already exists.";
        }
      }
      return res.status(422).render("auth/signUp",{
        pageTitle : "SignUp",
        currentPage : "signup",
        isLoggedIn : false,
        errors : [errorMessage],
        oldInput : {FirstName, LastName, UserName, email, userType},
      });
    })
  }

];
exports.postLogin = async(req, res, next) => {
  const {UserName, email, password} = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({$or : [{email : normalizedEmail}, {UserName : email}]})
    if(!user){
      return res.status(422).render("auth/loginpage",{
        pageTitle : "Login",
        currentPage : "Login",
        isLoggedIn : false,
        errors : ["User does not exist"],
        oldInput : {email, UserName},
        user : {},
      })
    }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(422).render("auth/loginpage",{
      pageTitle : "Login",
      currentPage : "Login",
      isLoggedIn : false,
      errors : ["Invalid Email or Password"],
      oldInput : {email, UserName},
      user : {},
    })
  }
  
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  if (user.userType === 'host') {
    res.redirect("/host/homelistpage");
  } else if(user.userType === 'guest'){
    res.redirect("/homes");
  }
}
exports.SocialLoginVerify = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const displayName = profile.displayName || '';
    const [FirstName = '', ...rest] = displayName.split(' ');
    const LastName = rest.join(' ') || '';
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        FirstName,
        LastName,
        UserName: email.split('@')[0],
        email,
        password: "GOOGLE_LOGIN",
        isSocialLogin: true,
        userType: "guest",
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};
// In controllers/auth.js
exports.SocialLoginSession = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/Login");
    const user = req.user;
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    if (user.userType === 'host') {
      res.redirect("/host/homelistpage");
    } else if (user.userType === 'guest') {
      res.redirect("/homes");
    } else {
      res.send("Unknown user type: " + user.userType);
    }
  } catch (err) {
    console.error("Error in Google Social Login session:", err);
    res.redirect("/Login");
  }
};
exports.postLogout = (req, res, next) => {
  if (!req.session) {
    return res.redirect("/Login");
  }

  // Clear all session data
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      return res.redirect("/");
    }
    
    // Clear the session cookie
    res.clearCookie('connect.sid');
    
    // Redirect to login page
    res.redirect("/Login");
  });
}
