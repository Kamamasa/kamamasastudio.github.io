/**
 * マークダウン内の特殊記法をボタンに変換する
 * @param {string} markdownText - 変換前のマークダウンテキスト
 * @returns {string} - ボタン記法が変換されたマークダウンテキスト
 */
function parseCustomButtons(markdownText) {
    let result = markdownText;

    // ボタン記法を個別に処理
    
    // [!download](URL "テキスト") または [!download](URL)
    result = result.replace(/\[!download\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || 'ダウンロード';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-download"${target}><i class="fa-solid fa-download"></i> ${buttonText}</a>`;
    });

    // [!github](URL "テキスト") または [!github](URL)
    result = result.replace(/\[!github\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || 'GitHubで見る';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-github f"${target}><i class="fa-brands fa-github"></i> ${buttonText}</a>`;
    });

    // [!link](URL "テキスト") または [!link](URL)
    result = result.replace(/\[!link\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || 'リンクを開く';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-link"${target}><i class="fa-solid fa-link"></i> ${buttonText}</a>`;
    });

    // [!demo](URL "テキスト") または [!demo](URL)
    result = result.replace(/\[!demo\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || 'デモを見る';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-demo"${target}><i class="fa-solid fa-laptop"></i> ${buttonText}</a>`;
    });

    // [!related](URL "テキスト") または [!related](URL)
    result = result.replace(/\[!related\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || '関連コンテンツ';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-related"${target}><i class="fa-solid fa-folder-open"></i> ${buttonText}</a>`;
    });

    // [!warning](URL "テキスト") または [!warning](URL)
    result = result.replace(/\[!warning\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || '注意事項';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-warning"${target}><i class="fa-solid fa-triangle-exclamation"></i> ${buttonText}</a>`;
    });

    // [!info](URL "テキスト") または [!info](URL)
    result = result.replace(/\[!info\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || '詳細情報';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-info"${target}><i class="fa-solid fa-circle-info"></i> ${buttonText}</a>`;
    });

    // [!secondary](URL "テキスト") または [!secondary](URL)
    result = result.replace(/\[!secondary\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || 'その他';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-secondary"${target}>${buttonText}</a>`;
    });

    // [!note](URL "テキスト") または [!note](URL)
    result = result.replace(/\[!note\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (match, url, text) => {
        const buttonText = text || 'ノートを見る';
        const target = url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}" class="btn btn-note"${target}><i class="fa-solid fa-book"></i> ${buttonText}</a>`;
    });

    // ボタングループ記法の処理 [!group] ... [!/group]
    result = result.replace(/\[!group\]([\s\S]*?)\[!\/group\]/g, (match, content) => {
        return `<div class="btn-group">${content}</div>`;
    });

    // 中央寄せボタン記法の処理 [!center] ... [!/center]
    result = result.replace(/\[!center\]([\s\S]*?)\[!\/center\]/g, (match, content) => {
        const centeredContent = content.replace(/class="(btn[^"]*)"/, 'class="$1 btn-center"');
        return centeredContent;
    });

    // 横幅いっぱいボタン記法の処理 [!full] ... [!/full]
    result = result.replace(/\[!full\]([\s\S]*?)\[!\/full\]/g, (match, content) => {
        const fullContent = content.replace(/class="(btn[^"]*)"/, 'class="$1 btn-full"');
        return fullContent;
    });

    // サイズ修飾子の処理
    result = result.replace(/\[!(small|large)-/g, '[!');
    result = result.replace(/class="(btn[^"]*)"([^>]*>)([^<]*)(small|large)-/g, (match, classes, attrs, text, size) => {
        const sizeClass = size === 'small' ? 'btn-sm' : 'btn-lg';
        return `class="${classes} ${sizeClass}"${attrs}${text.replace(size + '-', '')}`;
    });

    return result;
}

// 本題
document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('detail-main-content');
    const loadingSpinner = document.getElementById('loading-spinner');

    try {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');
        const category = params.get('category');

        if (!projectId || !category) {
            throw new Error('プロジェクト情報が不足しています。');
        }

        let jsonPath,mdPath
        jsonPath = `../json/projects_list_${category}.json`
        mdPath = `../article/project_${category}/${projectId}.md`

        const [metaResponse, markdownResponse] = await Promise.all([
            fetch(jsonPath),
            fetch(mdPath).then(res => {
                if (!res.ok) throw new Error(`マークダウンファイルが見つかりません: ${res.statusText}`);
                return res.text();
            })
        ]);

        const projectsList = await metaResponse.json();
        let markdownText = markdownResponse;

        const projectMeta = projectsList.find(p => p.id === projectId);
        if (!projectMeta) {
            throw new Error('指定されたプロジェクトが見つかりませんでした。');
        }

        // 強調ワード
        const importantTags = ['二次利用禁止','三次利用禁止', 'バグあり', '試作品', '取扱注意'];
        
        // HTMLコンテンツを生成

        document.title = projectMeta.title + " | Kamamasastudio";

        const contentHTML = `
            <div class="project-header">
                <h1 class="project-title">${projectMeta.title}</h1>
                <div class="project-meta">
                    <span><i class="fa-solid fa-calendar-day"></i> 公開: ${projectMeta.publishDate}</span>
                    <span><i class="fa-solid fa-arrows-rotate"></i> 更新: ${projectMeta.updateDate}</span>
                </div>
                <div class="project-tech">
                    ${projectMeta.techStack.map(tech => {
                        const isImportant = importantTags.includes(tech);
                        return `<span class="tech-tag ${isImportant ? 'important-tag' : ''}">${tech}</span>`;
                    }).join('')}
                </div>
            </div>
            <div id="markdown-content" class="markdown-content">
                <!-- マークダウンコンテンツがここに入る -->
            </div>
            <div class="back-button-container">
                <a href="projects.html" class="back-button">プロジェクト一覧へ戻る</a>
            </div>
        `;
        
        loadingSpinner.style.display = 'none';
        mainContent.innerHTML = contentHTML;

        // カスタムボタン記法を処理してからマークダウンを変換
        if (markdownText) {
            const processedMarkdown = parseCustomButtons(markdownText);
            const markdownContainer = document.getElementById('markdown-content');
            markdownContainer.innerHTML = marked.parse(processedMarkdown);
        }

    } catch (error) {
        console.error('詳細ページの表示に失敗しました:', error);
        loadingSpinner.style.display = 'none';
        mainContent.innerHTML = `
            <div class="error-state" style="text-align: center; color: #f87171;">
                <h2>コンテンツの読み込みに失敗しました</h2>
                <p>${error.message}</p>
                <div class="back-button-container">
                     <a href="projects.html" class="back-button">プロジェクト一覧へ戻る</a>
                </div>
            </div>`;
    }
});