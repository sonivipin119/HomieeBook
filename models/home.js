
const mongoose = require('mongoose');

const HomeSchema = mongoose.Schema({
  Home : { type:String, required: true},
  Price : { type: Number, required: true},
  Location : { type: String, required: true},
  rating : { type: Number, required: true},
  photo: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
  },
  description :  String,
  amenities: [String],
  houseFeatures :  {
    Bedrooms: { type: Number, required: true },
    Bathrooms: { type: Number, required: true },
    Balconies: { type: Number, required: true },
    Kitchen: { type: String, required: true },
    Parking: { type: String, required: true },
    Furnishing: { type: String, required: true }
  }
})
// HomeSchema.pre('findOneAndDelete', async function(next){
//   const homeId = this.getQuery()._id;
//   await favourite.deleteMany({houseId: homeId});
//   next();
// })
module.exports = mongoose.model('Homigister', HomeSchema);



/*
this.Home = Home;
    this.Price = Price;
    this.Location = Location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    if(_id){
    this._id = _id;
    }
    save()
    static find()
    static findById(homeId)
    static DeleteById(homeId){
*/
