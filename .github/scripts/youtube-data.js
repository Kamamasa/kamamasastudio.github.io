// .github/scripts/format-youtube-data.js
const fs = require('fs');

// YouTube APIレスポンスを読み込み
const rawData = JSON.parse(fs.readFileSync('site_data/json/youtube_videos.json', 'utf8'));

// データを整形
const formattedVideos = rawData.items.map(item => {
    // 再生数をフォーマット（例：1,234,567 → 123万）
    const formatViewCount = (count) => {
        const num = parseInt(count);
        if (num >= 10000000) return Math.floor(num / 10000000) + '千万';
        if (num >= 1000000) return Math.floor(num / 1000000) + '百万';
        if (num >= 10000) return Math.floor(num / 10000) + '万';
        return num.toLocaleString();
    };

    // 日付をフォーマット
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description.substring(0, 100) + '...',
        thumbnail: {
            default: item.snippet.thumbnails.default.url,
            medium: item.snippet.thumbnails.medium.url,
            high: item.snippet.thumbnails.high.url
        },
        url: `https://www.youtube.com/watch?v=${item.id}`,
        publishedAt: formatDate(item.snippet.publishedAt),
        viewCount: formatViewCount(item.statistics.viewCount),
        viewCountRaw: parseInt(item.statistics.viewCount),
        likeCount: parseInt(item.statistics.likeCount || 0),
        commentCount: parseInt(item.statistics.commentCount || 0)
    };
});

// 整形されたデータを保存
const outputData = {
    lastUpdated: new Date().toISOString(),
    videos: formattedVideos
};

fs.writeFileSync('site_data/json/youtube_videos.json', JSON.stringify(outputData, null, 2));

console.log(`✅ Updated ${formattedVideos.length} videos data`);
console.log('Videos:', formattedVideos.map(v => v.title).join(', '));