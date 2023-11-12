import { renderStats } from "./statsRenderer.js";
import { initVideosAndStats } from "./videoStats.js";

export let keywordWatchTimes = {}; // Keep track of keyword watch times
export let discardedKeywordWatchTimes = {}; // Keep track of keyword watch times
const stats = []

export function sendKeywordWatchTimes() {
    // console.log('Sending keywordWatchTimes:', keywordWatchTimes);
    const tempKeywordWatchTimes = { ...keywordWatchTimes }
    fetch('/endpoint-to-handle-keyword-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(keywordWatchTimes),
    })
        .then(response => response.json())
        .then(data => {
            stats.push({
                keywordWatchTimes: tempKeywordWatchTimes,
                mostRelevantKeyword: data.most_relevant_keyword,
                similarityMatrix: data.similarity_matrix,
            })
            Object.keys(keywordWatchTimes).forEach((keyword) => {
                discardedKeywordWatchTimes[keyword] = keywordWatchTimes[keyword];
                delete keywordWatchTimes[keyword];
            });
            if (data.videos && data.videos.length > 0) {
                initVideosAndStats(data.videos);
            }
            renderStats(stats)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
