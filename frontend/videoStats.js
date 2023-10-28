function initVideosAndStats(videos) {
    const videoContainer = document.getElementById('videoContainer');
    videos.forEach(video => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const wrapper = document.createElement('div');
        wrapper.className = 'videoWrapper';

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
        slide.appendChild(wrapper);
        videoContainer.appendChild(slide);
    });
}
