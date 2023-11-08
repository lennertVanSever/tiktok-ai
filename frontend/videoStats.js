// videoStats.js
let keywordWatchTimes = {};

function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

export function initVideosAndStats(videos, swiper = null) {
    const videoContainer = document.getElementById('videoContainer');

    videos.forEach((video) => {
        video.keys.forEach((keyword) => {
            if (!(keyword in keywordWatchTimes)) {
                keywordWatchTimes[keyword] = 0;
            }
        });

        const slide = htmlToElement(`
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

    // Update Swiper instance if it's passed as a parameter
    if (swiper) {
        swiper.update();
    }
}

export function sendKeywordWatchTimes(swiper) {
    console.log('Sending keywordWatchTimes:', keywordWatchTimes);
    fetch('/endpoint-to-handle-keyword-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(keywordWatchTimes),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);

            // Reset keyword watch times after sending
            Object.keys(keywordWatchTimes).forEach((keyword) => {
                keywordWatchTimes[keyword] = 0;
            });

            // Initialize new videos if any are returned
            if (data.videos && data.videos.length > 0) {
                initVideosAndStats(data.videos, swiper);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
