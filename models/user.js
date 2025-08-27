const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  FirstName : { type:String, required: [true, "First Name is required"]},
  LastName : {type :String},
  UserName : {type : String, required: [true, "User Name is required"],unique : true},
  email :{
    type : String,
    required : [true, "Email is required"],
    unique : true,
  },
  password: { type: String, required: function() { return !this.isSocialLogin; } },
  isSocialLogin: { type: Boolean, default: false },
  
  userType : {
    type : String,
    enum : ["guest", "host"],
    default : "guest",
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homigister'
  }]
});

// Pre-save middleware to handle favourites based on userType
UserSchema.pre('save', function(next) {
  if (this.userType === 'host') {
    this.favourites = undefined; // Remove favourites for host users
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);



