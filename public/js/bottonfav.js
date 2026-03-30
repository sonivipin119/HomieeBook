console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Ready");

  const buttons = document.querySelectorAll(".likeButton");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      console.log("Clicked");

      const heartIcon = btn.querySelector(".heartIcon");

      if (heartIcon.classList.contains("far")) {
        heartIcon.classList.remove("far");
        heartIcon.classList.add("fas", "text-red-500");
      } else {
        heartIcon.classList.remove("fas", "text-red-500");
        heartIcon.classList.add("far");
      }

      const homeId = btn.closest("form").querySelector('input[name="homeId"]').value;

      await fetch("/favourite-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ homeId }),
      });
    });
  });
});