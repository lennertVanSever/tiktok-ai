document.addEventListener('DOMContentLoaded', async () => {
    // Fetch video data from JSON file
    const response = await fetch('videos.json');
    const videosData = await response.json();
    const videoContainer = document.getElementById('videoContainer');
    let currentVideo = 1;
    let watchedTimes = {};

    videosData.forEach((video, index) => {
        const videoElement = document.createElement('video');
        videoElement.id = `video${video.id}`;
        videoElement.className = 'videoItem';
        videoElement.autoplay = index === 0; // Autoplay the first video
        videoElement.muted = true;
        videoElement.loop = true;

        const sourceElement = document.createElement('source');
        sourceElement.src = video.src;
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);

        const statsElement = document.createElement('div');
        statsElement.id = `stats${video.id}`;
        statsElement.className = 'stats';
        statsElement.textContent = 'Watched: 0s';

        const wrapper = document.createElement('div');
        wrapper.className = `videoWrapper videoWrapper${video.id}`;
        wrapper.style.top = `${index * 100}vh`;

        wrapper.appendChild(videoElement);
        wrapper.appendChild(statsElement);

        videoContainer.appendChild(wrapper);
    });

    let initialY = null;
    let isScrolling = false;

    function changeVideo(direction) {
        if (isScrolling) return;

        isScrolling = true;
        const wrappers = document.querySelectorAll('.videoWrapper');

        wrappers.forEach((wrapper, index) => {
            const topValue = parseInt(wrapper.style.top, 10) - 100 * direction + 'vh';
            wrapper.style.top = topValue;

            if (parseInt(topValue, 10) === 0) {
                const videoId = videosData[index].id;
                const videoElement = document.getElementById(`video${videoId}`);
                videoElement.play();
            } else {
                const videoId = videosData[index].id;
                const videoElement = document.getElementById(`video${videoId}`);
                videoElement.pause();
            }
        });

        setTimeout(() => {
            isScrolling = false;
        }, 300);
    }

    function updateStats(videoId, time) {
        const statsElement = document.getElementById(`stats${videoId}`);
        watchedTimes[videoId] += time;
        statsElement.textContent = `Watched: ${Math.round(watchedTimes[videoId])}s`;
    }

    function togglePlayPause(videoElement) {
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }

    videoContainer.addEventListener('touchstart', e => {
        initialY = e.touches[0].clientY;
    }, false);

    videoContainer.addEventListener('touchmove', e => {
        if (initialY === null) return;

        const currentY = e.touches[0].clientY;
        const diffY = initialY - currentY;

        if (Math.abs(diffY) > 100) {
            changeVideo(diffY > 0 ? 1 : -1);
            initialY = null;
        }
    }, false);

    videosData.forEach((video) => {
        const videoId = video.id;
        const videoElement = document.getElementById(`video${videoId}`);
        watchedTimes[videoId] = 0;

        videoElement.addEventListener('ended', () => {
            videoElement.currentTime = 0;
            videoElement.play();
        });

        videoElement.addEventListener('timeupdate', () => {
            updateStats(videoId, videoElement.currentTime - (watchedTimes[videoId] || 0));
        });

        videoElement.addEventListener('click', () => togglePlayPause(videoElement));
    });
});
