import { sendKeywordWatchTimes } from './api.js';

export function initSwipers() {
    // Initialize the outer (vertical) Swiper
    const verticalSwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: true,
        noSwipingClass: 'swiper-no-swiping',
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        on: {
            reachEnd: function () {
                sendKeywordWatchTimes();
            },
        },
    });

    // Initialize the inner (horizontal) Swipers for each video
    document.querySelectorAll('.swiper-container-horizontal').forEach((container, index) => {
        new Swiper(container, {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 0,
            nested: true,
            on: {
                slideChangeTransitionEnd: function () {
                    verticalSwiper.slideTo(index, 0, false);
                }
            }
        });
    });
}
