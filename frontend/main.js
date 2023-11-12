// main.js
import { initVideosAndStats } from './videoStats.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to AlgoRhytm! Start swiping down whenever you are ready.")
    // Fetch videos from videos.json
    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            initVideosAndStats(videos);  // Initialize videos and stats
        })
        .catch(error => console.error('Error fetching video JSON:', error));

    document.getElementById('closeButton').addEventListener('click', () => {
        console.log("close stats")
        document.getElementById('statsOverview').style.display = 'none';
    })
});
