
const handlePayment = async (houseId, checkInDate, checkOutDate, price, guests) => {
  try {
    console.log("Payment button clicked");

    // 1. Create order
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        totalPrice: price   // 🔥 THIS IS REQUIRED
      })
    });
    console.log("Create order response:", res);
    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    const order = await res.json();
    console.log("Order:", order);
    
    // 2. Razorpay options
    const options = {
      key: "rzp_test_SXv617L4CmXnjq", // 🔑 replace with your key
      amount: order.amount, // Convert to paise
      currency: "INR",
      order_id: order.id,
      method: {
        upi: true,
        card: true
      },
      name: "Homieebook",
      description: "Premium Purchase",

      handler: async function (response) {
        console.log("Payment response:", response);

        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          ...response,
          houseId: houseId,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          totalPrice: price,
          numberOfGuests: guests
        }),
        });

        const data = await verifyRes.json();

        if (data.success) {
          alert("Thank you for payment 🎉");
          window.location.href = "/";
        } else {
          alert("Payment verification failed ❌");
        }
      },

      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        }
      },

      theme: {
        color: "#3399cc",
      },
    };

    // 3. Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment Error:", err);
    alert("Something went wrong ❌");
  }
};