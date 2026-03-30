const User = require("../models/user");

const oauthVerify = async (profile) => {
  try {
    const email = profile.emails?.[0]?.value;
    const displayName = profile.displayName || "";

    const [FirstName = "", ...rest] = displayName.split(" ");
    const LastName = rest.join(" ") || "";

    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        FirstName,
        LastName,
        UserName: email.split("@")[0],
        email,
        password: "GOOGLE_LOGIN",
        isSocialLogin: true,
        userType: "guest",
      });
      await user.save();
      console.log("Creating new user from Google profile:", user);
    }else {
      console.log("✅ Existing user found:", user);
    }

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = oauthVerify;