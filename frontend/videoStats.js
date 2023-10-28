// videoStats.js
function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function initVideosAndStats(videos) {
    const videoContainer = document.getElementById('videoContainer');
    videos.forEach(video => {
        let watchedTimeAllReplays = 0;
        let watchTime = 0;

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
            watchedTimeAllReplays += videoElement.duration;
            videoElement.play();
        });

        videoElement.addEventListener('timeupdate', () => {
            const currentTime = videoElement.currentTime;
            watchTime = currentTime + watchedTimeAllReplays;
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
}

export { initVideosAndStats };
