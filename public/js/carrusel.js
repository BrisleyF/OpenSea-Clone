window.addEventListener('load', function () {
    new Glider(document.querySelector('.carousel__lista'), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: {
            prev: '.carousel__anterior',
            next: '.carousel__siguiente' 
        },
        responsive: [
            {
                // screens greater than >= 775px
                breakpoint: 450,
                settings: {
                    // Set to `auto` and provide item width to adjust to viewport
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                // screens greater than >= 1024px
                breakpoint: 800,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            }
        ]
    });
});


window.addEventListener('load', function () {
    new Glider(document.querySelector('.carousel__lista_2'), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: {
            prev: '.carousel__anterior_2',
            next: '.carousel__siguiente_2' 
        },
        responsive: [
            {
                // screens greater than >= 775px
                breakpoint: 450,
                settings: {
                    // Set to `auto` and provide item width to adjust to viewport
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                // screens greater than >= 1024px
                breakpoint: 800,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5
                }
            }
        ]
    });
});


window.addEventListener('load', function () {
    new Glider(document.querySelector('.carousel__lista_3'), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: {
            prev: '.carousel__anterior_3',
            next: '.carousel__siguiente_3' 
        },
        responsive: [
            {
                // screens greater than >= 775px
                breakpoint: 450,
                settings: {
                    // Set to `auto` and provide item width to adjust to viewport
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                // screens greater than >= 1024px
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    });
});
