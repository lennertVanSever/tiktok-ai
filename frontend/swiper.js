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
}
