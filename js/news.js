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
    
    // 各ニュース項目を生成
    sortedNews.forEach((news, index) => {
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

        // リンクがある場合はクリック可能にする（innerHTML設定後に追加）
        if (news.link && news.link.trim() !== '') {
            li.classList.add('clickable');
            li.style.cursor = 'pointer';
            
            li.onclick = function() {
                window.open(news.link, '_self');
            };
        }

        
        newsList.appendChild(li);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    loadNewsFromFile().then(newsData => {
        createNewsList(newsData);
    });
});
