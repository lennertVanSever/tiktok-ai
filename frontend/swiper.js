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
            reachEnd: () => {
                console.log("Reached end of videos")
                sendKeywordWatchTimes();
            },
            reachBeginning: () => {
                console.log("Back on welcome page")
            },
            slideNextTransitionStart: () => {
                console.log("Slide to next video")
            },
            slidePrevTransitionStart: () => {
                console.log("Slide to previous video")
            },
        },
    });
}
