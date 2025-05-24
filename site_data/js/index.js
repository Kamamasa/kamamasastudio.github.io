async function loadYouTubeVideos() {
    try {
        const response = await fetch('/site_data/json/youtube_videos.json');
        if (!response.ok) throw new Error('データの取得に失敗しました');
        
        const data = await response.json();
        displayVideos(data.videos);
        
        // 最終更新時刻を表示
        const lastUpdated = new Date(data.lastUpdated);
        document.getElementById('last-updated').textContent = 
            `最終更新: ${lastUpdated.toLocaleDateString('ja-JP')} ${lastUpdated.toLocaleTimeString('ja-JP')}`;
        
    } catch (error) {
        console.error('Error loading YouTube videos:', error);
        document.getElementById('youtube-container').innerHTML = 
            '<div class="error">動画の読み込みに失敗しました</div>';
    }
}

function displayVideos(videos) {
    const container = document.getElementById('youtube-container');
    
    if (!videos || videos.length === 0) {
        container.innerHTML = '<div class="error">動画が見つかりませんでした</div>';
        return;
    }

    const videosHTML = videos.map(video => `
        <div class="youtube-video">
            <div class="video-thumbnail" 
                  style="background-image: url('${video.thumbnail.medium}')"
                  onclick="window.open('${video.url}', '_blank')">
            </div>
            <div class="video-info">
                <h4 class="video-title">${video.title}</h4>
                <div class="video-meta">
                    <span class="video-date">${video.publishedAt}</span>
                    <span class="video-views">${video.viewCount}回再生</span>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="youtube-videos">${videosHTML}</div>`;
}

async function loadTwitterData() {
    try {
        let response;
        response = await fetch('/site_data/json/twitter_data.json');
        
        if (!response || !response.ok) {
            throw new Error(`HTTPエラー: ${response?.status} ${response?.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        const text = await response.text();
        console.log('Response text length:', text.length);
        console.log('First 100 chars:', text.substring(0, 100));
        
        if (!text.trim()) {
            throw new Error('空のレスポンスです');
        }
        
        const data = JSON.parse(text);
        displayTwitterData(data);
        
        // 最終更新時刻を表示
        const lastUpdated = new Date(data.lastUpdated);
        document.getElementById('last-updated').textContent = 
            `最終更新: ${lastUpdated.toLocaleDateString('ja-JP')} ${lastUpdated.toLocaleTimeString('ja-JP')}`;
        
    } catch (error) {
        console.error('Error loading Twitter data:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        document.getElementById('twitter-container').innerHTML = 
            `<div class="error">
                Twitter情報の読み込みに失敗しました<br>
                <small>エラー: ${error.message}</small><br>
                <small>コンソールで詳細を確認してください</small>
            </div>`;
    }
}

function displayTwitterData(data) {
    const container = document.getElementById('twitter-container');
    
    if (!data.user) {
        container.innerHTML = '<div class="error">ユーザー情報が見つかりませんでした</div>';
        return;
    }

    // ユーザー情報の表示
    const userInfoHTML = `
        <a class="user-info" href="https://twitter.com/${data.user.username}" target="_blank">
            <div class="user-name">${data.user.name || 'Unknown User'}</div>
            <div class="user-handle">@${data.user.username || 'unknown'}</div>
            <div class="user-stats">
                <div class="stat-item">
                    <span class="stat-number">${formatNumber(data.user.followers_count || 0)}</span>
                    <div class="stat-label">フォロワー</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${formatNumber(data.user.following_count || 0)}</span>
                    <div class="stat-label">フォロー</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${formatNumber(data.user.tweet_count || 0)}</span>
                    <div class="stat-label">ツイート</div>
                </div>
            </div>
        </a>
    `;

    // ツイートの表示
    let tweetsHTML = '';
    if (data.tweets && data.tweets.length > 0) {
        const tweetsListHTML = data.tweets.map(tweet => `
            <div class="tweet-item">
                <div class="tweet-content">${tweet.text || 'ツイート内容なし'}</div>
                <div class="tweet-meta">
                    <div class="tweet-date">${formatDate(tweet.created_at)}</div>
                    <div class="tweet-stats">
                        <span class="tweet-stat replies">${formatNumber(tweet.reply_count || 0)}</span>
                        <span class="tweet-stat retweets">${formatNumber(tweet.retweet_count || 0)}</span>
                        <span class="tweet-stat likes">${formatNumber(tweet.like_count || 0)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        tweetsHTML = `<div class="tweets-container">${tweetsListHTML}</div>`;
    } else {
        tweetsHTML = '<div class="error">最近のツイートが見つかりませんでした</div>';
    }

    container.innerHTML = userInfoHTML + tweetsHTML;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    if (!dateString) return '日時不明';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes}分前`;
        } else if (diffHours < 24) {
            return `${diffHours}時間前`;
        } else if (diffDays < 7) {
            return `${diffDays}日前`;
        } else {
            return date.toLocaleDateString('ja-JP', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    } catch (error) {
        console.error('Date formatting error:', error);
        return '日時不明';
    }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', loadYouTubeVideos);
document.addEventListener('DOMContentLoaded', loadTwitterData);