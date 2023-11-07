// main.js
import { initVideosAndStats, sendKeywordWatchTimes } from './videoStats.js';

document.addEventListener('DOMContentLoaded', () => {
    // Fetch videos from videos.json
    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            initVideosAndStats(videos);  // Initialize videos and stats

            new Swiper('.swiper-container', {
                direction: 'vertical',
                slidesPerView: 1,
                spaceBetween: 0,
                mousewheel: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                on: {
                    reachEnd: function () {
                        sendKeywordWatchTimes(this);
                    },
                },
            });

        })
        .catch(error => console.error('Error fetching video JSON:', error));
});
