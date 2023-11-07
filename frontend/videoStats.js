// videoStats.js
let keywordWatchTimes = {};

function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export function initVideosAndStats(videos, swiper = null) {
    const videoContainer = document.getElementById('videoContainer');

    videos.forEach(video => {
        // Initialize watch time for each keyword of this video if not already present
        video.keys.forEach(keyword => {
            keywordWatchTimes[keyword] = keywordWatchTimes[keyword] || 0;
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
            // Reset the watch time when the video ends and starts over
            keywordWatchTimes[video.keys] += videoElement.duration;
            videoElement.play();
        });

        videoElement.addEventListener('timeupdate', () => {
            // Update the watch time for the current video
            video.keys.forEach(keyword => {
                keywordWatchTimes[keyword] += videoElement.currentTime;
            });

            const watchTime = videoElement.currentTime;
            stats.innerText = `Watchtime: ${Math.floor(watchTime)}s`;
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

    if (swiper) {
        swiper.update();
    }
}

export function sendKeywordWatchTimes(swiper) {
    console.log('keywordWatchTimes', keywordWatchTimes)
    fetch('/endpoint-to-handle-keyword-data', { // Replace with your actual endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(keywordWatchTimes),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            // Check if new videos are returned and initialize them
            if (data.videos && data.videos.length > 0) {
                initVideosAndStats(data.videos, swiper);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    // Reset keyword watch times after sending
    keywordWatchTimes = {};
}