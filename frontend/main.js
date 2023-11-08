// main.js
import { initVideosAndStats } from './videoStats.js';

document.addEventListener('DOMContentLoaded', () => {
    // Fetch videos from videos.json
    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            initVideosAndStats(videos);  // Initialize videos and stats
        })
        .catch(error => console.error('Error fetching video JSON:', error));
});
