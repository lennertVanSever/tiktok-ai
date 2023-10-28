document.addEventListener('DOMContentLoaded', () => {
    // Fetch videos from videos.json
    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            initVideosAndStats(videos);  // Initialize videos and stats

            const swiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                slidesPerView: 1,
                spaceBetween: 0,
                mousewheel: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });

        })
        .catch(error => console.error('Error fetching video JSON:', error));
});
