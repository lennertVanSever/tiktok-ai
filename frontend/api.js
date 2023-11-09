import { initVideosAndStats } from "./videoStats.js";

export let keywordWatchTimes = {}; // Keep track of keyword watch times

export function sendKeywordWatchTimes() {
    console.log('Sending keywordWatchTimes:', keywordWatchTimes);
    fetch('/endpoint-to-handle-keyword-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(keywordWatchTimes),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            Object.keys(keywordWatchTimes).forEach((keyword) => {
                keywordWatchTimes[keyword] = 0;
            });
            if (data.videos && data.videos.length > 0) {
                initVideosAndStats(data.videos);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
