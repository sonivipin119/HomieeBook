const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/booking");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { totalPrice } = req.body; 

    if (!totalPrice) {
      return res.status(400).json({ error: "Price is required" });
    }

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// VERIFY PAYMENT + SAVE BOOKING
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      houseId,
      checkInDate,
      checkOutDate,
      totalPrice,
      numberOfGuests
    } = req.body;

    // verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment" });
    }

    // ensure user exists
    if (!req.session.user) {
      return res.status(401).json({ message: "Please login first" });
    }

    // SAVE BOOKING
    const booking = await Booking.create({
      houseId,
      userId: req.session.user._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      numberOfGuests,
      status: "confirmed"
    });

    console.log("Booking saved:", booking);

    res.json({
      success: true,
      message: "Payment verified & booking confirmed",
      booking
    });

  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createOrder: exports.createOrder,
  verifyPayment: exports.verifyPayment
};