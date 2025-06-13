const twitter_json = 'site_data/json/twitter_data.json'
const youtube_json = 'site_data/json/youtube_data.json'


async function loadNewsFromFile() {
    try {
        const response = await fetch('/site_data/json/news.json');
        const newsData = await response.json();
        return newsData;
    } catch (error) {
        console.error('ニュースデータの読み込みに失敗しました:', error);
        return [];
    }
}

function getCategoryType(category) {
    const categoryMap = {
        'UPDATE': 'news-type-update',
        'RELEASE': 'news-type-release', 
        'PROJECT': 'news-type-project',
        'INFORMATION': 'news-type-info',
        'INFO': 'news-type-info',
        'MAINTENANCE': 'news-type-maintenance',
        'BLOG': 'news-type-blog'
    };
    
    return categoryMap[category.toUpperCase()] || 'news-type-info'; // デフォルトはinfo
}

// ニュースリストを生成する関数
function createNewsList(newsData) {
    const newsList = document.getElementById('newsList');
    
    // 日付でソート（新しい順）
    const sortedNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // リストをクリア
    newsList.innerHTML = '';
    
    let counter=0;
    // 各ニュース項目を生成
    sortedNews.forEach((news, index) => {
        if (counter===3) return;
        const li = document.createElement('li');
        li.style.animationDelay = `${0.8 + index * 0.2}s`;
        
        // カテゴリから動的にtypeを生成
        const categoryType = getCategoryType(news.category);
        
        li.innerHTML = `
            <div class="news-header">
                <h4 class="news-category" data-type="${categoryType}">${news.category}</h4>
                <h4 class="news-timestamp">${news.date}</h4>
            </div>
            <p class="news-description">${news.description}</p>
        `;
        
        newsList.appendChild(li);
        counter++;
    });
}

async function loadYouTubeVideos() {
    try {
        const response = await fetch(youtube_json);
        if (!response.ok) throw new Error('データの取得に失敗しました');
        
        const data = await response.json();
        displayVideos(data.videos);
        
        // 最終更新時刻を表示
        const lastUpdated = new Date(data.lastUpdated);
        console.log(`Youtube 最終更新: ${lastUpdated.toLocaleDateString('ja-JP')} ${lastUpdated.toLocaleTimeString('ja-JP')}`)

        
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
        response = await fetch(twitter_json);
        
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
        console.log(`Twitter 最終更新: ${lastUpdated.toLocaleDateString('ja-JP')} ${lastUpdated.toLocaleTimeString('ja-JP')}`)

        
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
    container.innerHTML = userInfoHTML;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}





// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', loadYouTubeVideos);
document.addEventListener('DOMContentLoaded', loadTwitterData);
document.addEventListener('DOMContentLoaded', function() {
    loadNewsFromFile().then(newsData => {
        createNewsList(newsData);
    });
});
