const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const authcontroller= require("../controllers/auth");

authRouter.get("/Login",authcontroller.getLogin);
authRouter.post("/Login", authcontroller.postLogin);
// authRouter.post("/logout", authcontroller.postLogout);

authRouter.get("/logout", authcontroller.postLogout);
authRouter.get("/signUp", authcontroller.getsignUp);
authRouter.post("/signUp", authcontroller.postsignUp);

authRouter.get("/auth/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/" })
,authcontroller.SocialLoginSession
);

// authRouter.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/" })
// ,authcontroller.SocialLoginSession
// // , (req, res) => {
// //   req.session.isLoggedIn = true;
// //   req.session.user = req.user;
// //   req.session.save(() => {
// //     res.redirect('/homes');  
// //   });
// );

module.exports = authRouter;
