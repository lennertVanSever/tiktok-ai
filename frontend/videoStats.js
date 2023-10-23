function initVideosAndStats(videos) {
    const videoContainer = document.getElementById('videoContainer');
    let totalWatchedTime = 0;

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
        videoElement.loop = true;

        let watchedTime = 0;
        let lastTime = 0;

        const statsElement = document.createElement('div');
        statsElement.className = 'stats';
        statsElement.innerText = `Watched: 0s`;

        videoElement.addEventListener('timeupdate', () => {
            const currentTime = videoElement.currentTime;
            const timeWatched = currentTime - lastTime;
            watchedTime += timeWatched;
            lastTime = currentTime;

            statsElement.innerText = `Watched: ${Math.floor(watchedTime)}s`;
            totalWatchedTime += timeWatched;
        });

        videoElement.addEventListener('ended', () => {
            videoElement.currentTime = 0;
            videoElement.play();
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

    const summaryElement = document.createElement('div');
    summaryElement.className = 'summary';
    summaryElement.style.top = `${100 * videos.length}vh`;
    summaryElement.innerHTML = `<p>Total Time Watched: ${Math.floor(totalWatchedTime)}s</p>`;

    videoContainer.appendChild(summaryElement);
}
