document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('videos.json');
    const videosData = await response.json();
    const videoContainer = document.getElementById('videoContainer');
    let currentVideo = 1;

    let initialY = null;
    let isScrolling = false;
    let totalWatchedTime = 0;

    videosData.forEach((video, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'videoWrapper';
        wrapper.style.top = `${index * 100}vh`;

        const videoElement = document.createElement('video');
        videoElement.id = `video${video.id}`;
        videoElement.className = 'videoItem';
        videoElement.src = video.src;
        videoElement.autoplay = index === 0;
        videoElement.muted = true;
        videoElement.loop = true;

        let watchedTime = 0;

        const statsElement = document.createElement('div');
        statsElement.className = 'stats';
        statsElement.innerText = `Watched: 0s`;

        videoElement.addEventListener('timeupdate', () => {
            watchedTime += 1;
            statsElement.innerText = `Watched: ${watchedTime}s`;
            totalWatchedTime += 1;
        });

        wrapper.appendChild(videoElement);
        wrapper.appendChild(statsElement);
        videoContainer.appendChild(wrapper);
    });

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
});
