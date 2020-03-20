


$("#arrow").on("click", function() {
    $("body, html").animate({
        scrollTop: $("main").offset().top
    }, 1000)
})


const ico = document.querySelector('.burger');
  ico.addEventListener("click", function () {
   ico.classList.toggle("active");
  })