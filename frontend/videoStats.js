// Import necessary functions from other modules
import { htmlToElement } from './utils.js';
import { initSwipers } from './swiper.js';
import { discardedKeywordWatchTimes, keywordWatchTimes } from './api.js';

// Function to initialize video statistics and video elements
export function initVideosAndStats(videos) {
    const videoContainer = document.getElementById('videoContainer');

    // Loop through each video object and create its HTML
    videos.forEach((video) => {
        // Check for each keyword and initialize it in the watch times object
        video.keys.forEach((keyword) => {
            if (!(keyword in keywordWatchTimes)) {
                keywordWatchTimes[keyword] = 0;
            }
        });

        // Create the HTML for each video slide
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
                        <div class="swiper-slide stats-screen swiper-no-swiping">
                            <div class="stats-table-container">
                                <!-- Table will be dynamically inserted here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Get references to video and stats elements
        const videoElement = slide.querySelector('video');
        const stats = slide.querySelector('.stats');

        // // Event listener for when the video ends
        videoElement.addEventListener('ended', () => {
            video.keys.forEach((keyword) => {
                keywordWatchTimes[keyword] += videoElement.duration;
            });
            videoElement.play();
        });

        // Event listener for video time updates
        videoElement.addEventListener('timeupdate', () => {
            const increment = videoElement.currentTime - (videoElement.lastTime || 0);
            videoElement.lastTime = videoElement.currentTime;

            video.keys.forEach((keyword) => {
                if (!discardedKeywordWatchTimes[keyword]) {
                    keywordWatchTimes[keyword] += increment;
                }
            });

            stats.innerText = `Watchtime: ${Math.floor(videoElement.currentTime)}s`;
        });

        // Event listener for video clicks (play/pause)
        videoElement.addEventListener('click', () => {
            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        });

        // Append the newly created slide to the container
        videoContainer.appendChild(slide);
    });
    // After all video slides are added to the DOM, initialize the Swiper
    initSwipers();
}
