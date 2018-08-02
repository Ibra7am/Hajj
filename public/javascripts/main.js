// $(document).ready(function () {
//     // to make the landing page header different than other pages
//     if($(location).attr('pathname').length > 1) {
//         $('header').addClass('header-space');
//     }
    
//     if($(location).attr('pathname').length <= 1) {
//         $('.slider-nav').slick({
//             centerMode: true,
//             // centerPadding: '100px',
//             slidesToShow: 3,
//             autoplay: true,
//             autoplaySpeed: 2000,
//             focusOnSelect: true,
//             variableWidth: true
//         });
//     }

//     $('#more-info').on('click', function () {
//         $('html, body').animate({
//           scrollTop: $('#section-2').offset().top - 200
//         }, 1000);
//     })
// });

// if($(location).attr('pathname').length == 1) {
//     $(window).bind('scroll', function () {
//         if ($(window).scrollTop() > 25) {
//           $('header').addClass('sticky');
//         } else {
//           $('header').removeClass('sticky');
//         }
//     });
// }