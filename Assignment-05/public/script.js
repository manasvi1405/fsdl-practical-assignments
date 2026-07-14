let slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
  slides.forEach(s => s.classList.remove("active"));
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 3000);
