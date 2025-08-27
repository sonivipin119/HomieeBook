const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homigister',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkIn = new Date(value);
        checkIn.setHours(0, 0, 0, 0);
        return checkIn >= today;
      },
      message: 'Check-in date must be today or in the future'
    }
  },
  checkOutDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const checkIn = new Date(this.checkInDate);
        checkIn.setHours(0, 0, 0, 0);
        const checkOut = new Date(value);
        checkOut.setHours(0, 0, 0, 0);
        return checkOut > checkIn;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
