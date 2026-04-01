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
    console.log("Verify Payment Request Body:", req.body);
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
    if (!razorpay_order_id || !razorpay_payment_id) {
      console.log("❌ Missing payment IDs");
      return res.status(400).json({ success: false });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Verifying payment with body:", body, "and signature:", razorpay_signature);
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
    console.log("Order ID", razorpay_order_id, "Payment ID:", razorpay_payment_id, "Signature:", razorpay_signature);
    // SAVE BOOKING
    const booking = await Booking.create({
      orderId: razorpay_order_id.replace("order_", "") || "N/A",
      paymentId: razorpay_payment_id.replace("pay_", "") || "N/A",
      houseId,
      userId: req.session.user._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      numberOfGuests,
      status: "confirmed",
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