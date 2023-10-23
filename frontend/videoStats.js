function initVideosAndStats(videos) {
    const videoContainer = document.getElementById('videoContainer');
    videos.forEach(video => {
        const wrapper = document.createElement('div');
        wrapper.className = 'videoWrapper';
        wrapper.style.top = `${100 * (video.id - 1)}vh`;

        const videoElement = document.createElement('video');
        videoElement.id = `video${video.id}`;
        videoElement.className = 'videoItem';
        videoElement.src = video.src;
        videoElement.autoplay = true;
        videoElement.muted = true;

        let watchedTimeAllReplays = 0;

        const statsElement = document.createElement('div');
        statsElement.className = 'stats';
        statsElement.innerText = `Watchtime: 0s`;

        videoElement.addEventListener('ended', () => {
            watchedTimeAllReplays += videoElement.duration;
            videoElement.play();
        });

        videoElement.addEventListener('timeupdate', () => {
            const currentTime = videoElement.currentTime;
            watchTime = currentTime + watchedTimeAllReplays;
            statsElement.innerText = `Watchtime: ${Math.floor(watchTime)}s`;
            // totalWatchedTime += currentTime;
        });

        videoElement.addEventListener('click', () => {
            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        });

        wrapper.appendChild(videoElement);
        wrapper.appendChild(statsElement);
        videoContainer.appendChild(wrapper);
    });
}
