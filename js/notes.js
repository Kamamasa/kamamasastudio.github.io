async function loadArticles() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const articleContainer = document.getElementById('articleContainer');
    
    try {
        const response = await fetch('../json/articles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const articles = data.articles;
        const defaultThumbnail = data.metadata.defaultThumbnail;
        
        // ローディング表示を削除
        loadingIndicator.remove();
        
        // 記事を日付順（新しい順）にソート
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 記事カードを生成
        articles.forEach((article, index) => {
            const articleCard = document.createElement('a');
            articleCard.href = `../html/article.html?id=${article.id}&category=note`;
            articleCard.className = 'article-card';
            articleCard.style.animationDelay = `${(index + 1) * 0.1}s`;
            
            // サムネイル要素を生成
            const thumbnailElement = article.hasImage 
                ? `<img src="../${article.thumbnail}" alt="${article.title}" class="card-thumbnail" onerror="this.outerHTML='<div class=\\'default-card-thumbnail\\'>No Image</div>'">`
                : `<div class="default-card-thumbnail">No Image</div>`;
            
            // タグ要素を生成
            const tagsHtml = article.tags ? 
                `<div class="card-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>` : '';
            
            const categoryMap = {
                "技術": "tech",
                "デザイン": "design",
                "DIY": "diy",
                "趣味": "hobby",
                "旅行": "travel",
            }

            // カテゴリ要素を生成
            const extraClass = categoryMap[article.category] || "other";
            const categoryHtml = article.category ? 
                `<div class="card-category ${extraClass}">${article.category}</div>` : '';

            // 記事カードのHTMLを生成            
            articleCard.innerHTML = `
                ${thumbnailElement}
                <div class="card-content">
                    <div class="card-header">
                        <h2 class="card-title">${article.title}</h2>
                        <p class="card-date">${formatDate(article.publishDate)}</p>
                        ${categoryHtml}
                    </div>
                    <p class="card-summary">${article.summary}</p>
                    ${tagsHtml}
                    <div class="card-footer">
                        <span class="read-more">Read More →</span>
                    </div>
                </div>
            `;
            
            articleContainer.appendChild(articleCard);
        });
        
    } catch (error) {
        console.error('記事の読み込みに失敗しました:', error);
        loadingIndicator.innerHTML = `
            <div class="error">
                記事の読み込みに失敗しました。<br>
                ${error.message}
            </div>
        `;
    }
}

// 日付フォーマット関数
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// ページ読み込み時に記事を読み込む
document.addEventListener('DOMContentLoaded', loadArticles);