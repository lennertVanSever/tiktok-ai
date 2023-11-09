// statsRenderer.js
export function renderStats(stats) {
    const statsHtml = stats.map((stat, index) => {
        // Create keyword watch times table rows
        let keywordWatchTimesRows = Object.entries(stat.keywordWatchTimes)
            .map(([keyword, time]) => `<tr><td>${keyword}</td><td>${time.toFixed(2)} seconds</td></tr>`)
            .join('');

        // Create similarity matrix rows
        let similarityMatrixRows = Object.entries(stat.similarityMatrix)
            .map(([keyword, matrix]) => {
                let matrixEntries = Object.entries(matrix)
                    .map(([word, score]) => `<div class="matrix-entry">${word}: ${score}</div>`)
                    .join('');
                return `<tr><td class="keyword-cell">${keyword}</td><td>${matrixEntries}</td></tr>`;
            })
            .join('');

        // Combine the two sets of rows and wrap in separate table tags
        return `
            <section class="data-set">
                <h3 class="data-set-title">Dataset ${index + 1}</h3>
                <div class="table-container">
                    <table class="keyword-table">
                        <thead>
                            <tr><th>Keyword</th><th>Watch Time (s)</th></tr>
                        </thead>
                        <tbody>
                            ${keywordWatchTimesRows}
                        </tbody>
                    </table>
                    <table class="similarity-table">
                        <thead>
                            <tr><th colspan="2">Similarity Matrix for keywords</th></tr>
                        </thead>
                        <tbody>
                            ${similarityMatrixRows}
                        </tbody>
                    </table>
                    <p class="most-relevant-keyword"><b>Most Relevant Word: ${stat.mostRelevantKeyword}</b></p>
                </div>
            </section>
        `;
    }).join('');
    document.querySelector('#statsOverviewContent').innerHTML = statsHtml;
}
