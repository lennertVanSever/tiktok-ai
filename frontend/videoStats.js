import { htmlToElement } from './utils.js';
import { initSwipers } from './swiper.js';
import { discardedKeywordWatchTimes, keywordWatchTimes } from './api.js';

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
                                <button>View stats</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const buttonElement = slide.querySelector('button');
        const videoElement = slide.querySelector('video');
        const stats = slide.querySelector('.stats');

        videoElement.addEventListener('ended', () => {
            video.keys.forEach((keyword) => {
                if (videoElement.duration) {
                    keywordWatchTimes[keyword] += videoElement.duration;
                }
            });
            videoElement.play();
        });

        videoElement.addEventListener('timeupdate', () => {
            const increment = videoElement.currentTime - (videoElement.lastTime || 0);
            videoElement.lastTime = videoElement.currentTime;

            video.keys.forEach((keyword) => {
                if (!discardedKeywordWatchTimes[keyword]) {
                    if (increment) {
                        keywordWatchTimes[keyword] += increment;
                    }
                }
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

        buttonElement.addEventListener('click', () => {
            console.log("open stats")
            document.getElementById('statsOverview').style.display = 'block';
        });

        videoContainer.appendChild(slide);

        // Define the callback function for the Intersection Observer
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(`Keywords of video playing:\n   * ${video.keys.join('\n   * ')}`);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 1.0
        });

        // Observe the video element
        observer.observe(videoElement);
    });

    initSwipers();
}
