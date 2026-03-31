const express = require("express");
const Paymentrouter = express.Router();

const { createOrder, verifyPayment } = require("../controllers/paymentControl");

Paymentrouter.post("/create-order", createOrder);
Paymentrouter.post("/verify", verifyPayment);

module.exports = Paymentrouter;