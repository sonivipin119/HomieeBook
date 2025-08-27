
document.getElementById("likeButton").addEventListener("click", function() {
  let heartIcon = document.getElementById("heartIcon");
  if (heartIcon.classList.contains("far")) {
    heartIcon.classList.remove("far");
    heartIcon.classList.add("fas", "text-red-500"); // Filled red heart
  } else {
    heartIcon.classList.remove("fas", "text-red-500");
    heartIcon.classList.add("far"); // Empty heart
  }
});