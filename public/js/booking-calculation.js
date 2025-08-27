console.log("booking.js is loaded into the browser!");

function initBookingCalculation() {
  console.log("initBookingCalculation actually running");

  const pricePerNight = parseFloat(document.getElementById("pricePerNight").value);
  const checkInInput = document.getElementById("checkInDate");
  const checkOutInput = document.getElementById("checkOutDate");
  const totalPriceDisplay = document.getElementById("totalPriceDisplay");
  const totalPriceInput = document.getElementById("totalPrice");
  const checkInDateError = document.getElementById("checkInDateError");
  const checkOutDateError = document.getElementById("checkOutDateError");
  const ErrorInDate = document.getElementById("ErrorInDate");

  function varifyDateInRange(checkInDate, checkOutDate) {
    // console.log("inside varifyDateInRangee");

    // if (!window.availableRanges || window.availableRanges.length === 0) {
    //   return false;
    // }
    // if(checkOutDate != null && checkOutDate < checkInDate){
    //   checkOutDateError.textContent = "Check-out date must be after check-in date."; 
    //   return false;
    // }
    console.log(window.availableRanges);
    for (const range of window.availableRanges) {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      rangeEnd.setDate(rangeEnd.getDate() - 1); // Make end date inclusive
      // console.log("rangeStart:", rangeStart, "rangeEnd:", rangeEnd);

      if (checkInDate >= rangeStart && checkOutDate <= rangeEnd) {
        console.log("Dates are within an available range.");
        ErrorInDate.textContent = "";
        checkOutDateError.textContent = "";
        return true;
      }
    }
    ErrorInDate.textContent = "Please select dates within available ranges.";
    return false;
  
}

  function validateDates() {
    const checkInDate = new Date(checkInInput.value);
    console.log("checkInDate:", checkInDate);
    console.log("today:", new Date());
    const checkOutDate = new Date(checkOutInput.value);
    console.log(checkInDate, checkOutDate);
    if (!checkInInput.value) {
      checkInDateError.textContent = "Check-in date is required.";
      return false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to midnight
      if (checkInDate < today) {
        // console.log("inside checkInDate");
        checkInDateError.textContent = "Check-in date must be today or in the future.";
        return false;
      } else {
        checkInDateError.textContent = "";
      }
    }
    if (!checkOutInput.value) {
      checkOutDateError.textContent = "Check-out date is required.";
      return false;
    } else {
      // console.log("inside checkOutDate");
      const nextAvailableDate = new Date(checkInInput.value);
      nextAvailableDate.setMonth(checkInDate.getMonth() + 2);

      if (checkOutDate <= checkInDate) {
        checkOutDateError.textContent = "Check-out date must be after check-in date.";
        return false;
      } else if (checkOutDate > nextAvailableDate) {
        checkOutDateError.textContent = "Check-out date must be within 2 months from the check-in date.";
        return false;
      } else if(checkOutDate > checkInDate) {

        if (!varifyDateInRange(checkInDate, checkOutDate)) {
          {
            return false;
          }
        }
      }
      else {
        checkOutDateError.textContent = "";
      }
    }
    return true;
  }

  function calculateTotalPrice() {
    if (!validateDates()) {
      totalPriceDisplay.textContent = "0";
      totalPriceInput.value = "0";
      return;
    }

    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * pricePerNight;

    totalPriceInput.value = totalPrice;
    totalPriceDisplay.textContent = totalPrice;
  }

  // Add event listeners
  checkInInput.addEventListener("change", () => {
    validateDates();
    calculateTotalPrice();
  });

  checkOutInput.addEventListener("change", () => {
    validateDates();
    calculateTotalPrice();
  });
  const bookingForm = document.getElementById("bookingForm");
  bookingForm.addEventListener("submit", (event) => {
    if (!validateDates()) {
      alert("Please correct the errors before submitting.");
      event.preventDefault(); // Prevent form submission if validation fails
    }
  });
}
