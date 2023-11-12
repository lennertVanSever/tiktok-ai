import { renderStats } from "./statsRenderer.js";
import { initVideosAndStats } from "./videoStats.js";

export let keywordWatchTimes = {}; // Keep track of keyword watch times
export let discardedKeywordWatchTimes = {}; // Keep track of keyword watch times
const stats = [];


function formatTable(data) {
    let maxKeywordLength = Math.max(...Object.keys(data).map(keyword => keyword.length), 'Keyword'.length);
    let header = `Keyword${' '.repeat(maxKeywordLength - 'Keyword'.length)} | Watchtime`;
    let separator = '-'.repeat(header.length);

    let table = [header, separator];

    for (const [keyword, watchTime] of Object.entries(data)) {
        let paddedKeyword = keyword + ' '.repeat(maxKeywordLength - keyword.length);
        table.push(`${paddedKeyword} | ${(Math.round(watchTime * 100) / 100).toFixed(2)}s`);
    }

    return table.join('\n');
}


export function sendKeywordWatchTimes() {

    console.log(`Information send to server: \n${formatTable(keywordWatchTimes)}`);


    const tempKeywordWatchTimes = { ...keywordWatchTimes };
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
            });
            Object.keys(keywordWatchTimes).forEach((keyword) => {
                discardedKeywordWatchTimes[keyword] = keywordWatchTimes[keyword];
                delete keywordWatchTimes[keyword];
            });
            if (data.videos && data.videos.length > 0) {
                console.log('Information received from server', data)
                initVideosAndStats(data.videos);
            }
            renderStats(stats);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
