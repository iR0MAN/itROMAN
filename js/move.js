$('li button').on('click', function () {
    const goToSection = "[data-section=" + $(this).attr('class') + "]";
    $(".navigation").toggleClass('nav-off');
    $('body, html').animate({
        scrollTop: $(goToSection).offset().top
    })


})