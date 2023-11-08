// videoStats.js
let keywordWatchTimes = {};

function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export function initVideosAndStats(videos) {
    const videoContainer = document.getElementById('videoContainer');

    videos.forEach((video) => {
        video.keys.forEach((keyword) => {
            if (!(keyword in keywordWatchTimes)) {
                keywordWatchTimes[keyword] = 0;
            }
        });

        const slide = htmlToElement(`
            <div class="swiper-slide">
                <div class="swiper-container-horizontal">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <div class="videoWrapper">
                                <video 
                                    id="video${video.id}" 
                                    class="videoItem" 
                                    src="${video.src}" 
                                    autoplay 
                                    muted
                                ></video>
                                <div class="stats">Watchtime: 0s</div>
                            </div>
                        </div>
                        <div class="swiper-slide stats-screen">
                            <h1>Put stats here</h1>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const videoElement = slide.querySelector('video');
        const stats = slide.querySelector('.stats');

        videoElement.addEventListener('ended', () => {
            video.keys.forEach((keyword) => {
                keywordWatchTimes[keyword] += videoElement.duration;
            });
            videoElement.play();
        });

        videoElement.addEventListener('timeupdate', () => {
            const increment = videoElement.currentTime - (videoElement.lastTime || 0);
            videoElement.lastTime = videoElement.currentTime;

            video.keys.forEach((keyword) => {
                keywordWatchTimes[keyword] += increment;
            });

            stats.innerText = `Watchtime: ${Math.floor(videoElement.currentTime)}s`;
        });

        videoElement.addEventListener('click', () => {
            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        });

        videoContainer.appendChild(slide);
    });

    initSwipers();
}

function initSwipers() {
    // Initialize the outer (vertical) Swiper
    const verticalSwiper = new Swiper('.swiper-container', {
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
                // When the user reaches the end of the vertical swiper, send the watch times
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
                    // This ensures we are on the correct vertical slide after horizontal swipe
                    verticalSwiper.slideTo(index, 0, false);
                }
            }
        });
    });
}

function sendKeywordWatchTimes() {
    console.log('Sending keywordWatchTimes:', keywordWatchTimes);
    fetch('/endpoint-to-handle-keyword-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(keywordWatchTimes),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            Object.keys(keywordWatchTimes).forEach((keyword) => {
                keywordWatchTimes[keyword] = 0;
            });

            if (data.videos && data.videos.length > 0) {
                initVideosAndStats(data.videos);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
