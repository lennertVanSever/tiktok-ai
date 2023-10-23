document.addEventListener('DOMContentLoaded', () => {
    // Fetch videos from videos.json
    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            initVideosAndStats(videos); // Initialize videos and stats

            let currentVideo = 1;
            let totalVideos = videos.length;
            let initialY = null;
            const videoContainer = document.getElementById('videoContainer');

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

            function changeVideo(direction) {
                const video = document.getElementById(`video${currentVideo}`);
                video.pause();
                video.parentElement.style.top = `${-100 * direction}vh`;

                currentVideo += direction;

                if (currentVideo > totalVideos) {
                    currentVideo = 1;
                }

                if (currentVideo < 1) {
                    currentVideo = totalVideos;
                }

                const nextVideo = document.getElementById(`video${currentVideo}`);
                nextVideo.parentElement.style.top = '0';
                nextVideo.play();
            }
        })
        .catch(error => console.error('Error fetching video JSON:', error));
});
