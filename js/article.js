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

/**
 * カスタムコードタイトル記法を処理
 * ```language "title" の形式を <div class="code-title">title</div> 付きのコードブロックに変換
 */
function processCustomCodeTitles(markdown) {
    let customStyleCount = 0;
    let customStyles = [];
    
    return markdown.replace(/```(\w+)\s+"([^"]+)"(?:,\s*"([^"]+)")?\s*\n([\s\S]*?)```/g, (match, language, title, customStyle, code) => {
        let titleClass = `code-title ${language}`;
        let inlineStyle = '';
        
        // カスタムスタイルが指定されている場合
        if (customStyle) {
            customStyleCount++;
            const customClassName = `custom-${customStyleCount}`;
            titleClass = `code-title ${customClassName}`;
            
            // CSSルールを生成
            const cssRule = `.code-title.${customClassName} { ${customStyle} }`;
            customStyles.push(cssRule);
            
            // 動的にスタイルを追加
            addCustomStyle(cssRule);
        }
        
        return `<div class="code-block-container">
    <div class="${titleClass}">${title}</div>
    <pre><code class="language-${language}">${code.trim()}</code></pre>
</div>`;
    });
}

function addCustomStyle(cssRule) {
    // 既存のカスタムスタイルタグを取得または作成
    let styleElement = document.getElementById('custom-code-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-code-styles';
        document.head.appendChild(styleElement);
    }
    
    // スタイルルールを追加
    styleElement.textContent += cssRule + '\n';
}

/**
 * マークダウンの見出しにIDを付与し、手書きの目次リストにリンクを追加する
 */
function processTableOfContents(markdown) {
    // --- ステップ1: すべての見出しにIDを付与し、その結果から対応マップを作成 ---
    const headingMap = new Map();

    // IDがない見出しにIDを付与する
    const markdownWithIds = markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
        const cleanTitle = title.trim();
        // 既にID { #... } があれば、何もしない
        if (/{#.+?}$/.test(cleanTitle)) {
            return match;
        }
        const id = generateHeadingId(cleanTitle);
        return `${hashes} ${cleanTitle} {#${id}}`;
    });

    // IDが付与されたすべての見出しからマップを作成する
    const headingRegex = /^(?:#{1,6})\s+(.*?)\s*\{#(.+?)\}$/gm;
    let match;
    while ((match = headingRegex.exec(markdownWithIds)) !== null) {
        const title = match[1].trim();
        const id = match[2].trim();
        headingMap.set(title, id);
    }
    console.log('Generated Heading Map:', headingMap);
    
    return markdownWithIds;
}

/**
 * 見出しテキストからID用の文字列を生成
 */
function generateHeadingId(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s-]/g, '') // 日本語、英数字、ハイフン、スペースのみ残す
        .replace(/\s+/g, '-') // スペースをハイフンに
        .replace(/^-+|-+$/g, '') // 前後のハイフンを削除
        .replace(/--+/g, '-') // 連続するハイフンを単一に
        || 'heading'; // 空の場合のフォールバック
}

/**
 * 変換後のHTMLに見出しIDを追加する関数
 */
function addHeadingIds(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // すべての見出し要素を取得
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headings.forEach(heading => {
        const text = heading.textContent;
        
        // {#id} 記法を確認
        const idMatch = text.match(/^(.*?)\s*\{#([^}]+)\}$/);
        if (idMatch) {
            const cleanText = idMatch[1].trim();
            const id = idMatch[2];
            heading.textContent = cleanText;
            heading.id = id;
        } else if (!heading.id) {
            // IDがない場合は自動生成
            const id = generateHeadingId(text);
            heading.id = id;
        }
    });
    
    return doc.body.innerHTML;
}

/**
 * marked.jsのレンダラーをカスタマイズして見出しにIDを付与
 */
function setupMarkedRenderer() {
    // デフォルトのレンダラーを使用（カスタマイズを最小限に）
    const renderer = new marked.Renderer();
    return renderer;
}

/**
 * スムーズスクロールを設定（遅延実行版）
 */
function setupSmoothScroll() {
    // DOM操作後に少し遅延してリンクを設定
    setTimeout(() => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            // 既にイベントリスナーが追加されている場合はスキップ
            if (link.hasAttribute('data-scroll-listener')) {
                return;
            }
            
            link.setAttribute('data-scroll-listener', 'true');
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                console.log('Clicking link to:', targetId); // デバッグ用
                console.log('Target element found:', !!targetElement); // デバッグ用
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // URLを更新（履歴には残さない）
                    history.replaceState(null, null, `#${targetId}`);
                } else {
                    console.warn('Target element not found for ID:', targetId);
                }
            });
        });
        
        console.log('Smooth scroll setup complete. Found links:', document.querySelectorAll('a[href^="#"]').length);
    }, 100);
}

// 本題
document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('detail-main-content');
    const loadingSpinner = document.getElementById('loading-spinner');

    // marked.jsのレンダラーを設定（最初に実行）
    const customRenderer = setupMarkedRenderer();
    marked.setOptions({
        renderer: customRenderer,
        breaks: true,
        gfm: true,
        sanitize: false
    });

    try {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');
        const category = params.get('category');

        if (!projectId || !category) {
            throw new Error('プロジェクト情報が不足しています。');
        }

        let jsonPath, mdPath;
        jsonPath = `../json/articles.json`;
        mdPath = `../article/note/${projectId}/note.md`;

        const [metaResponse, markdownResponse] = await Promise.all([
            fetch(jsonPath),
            fetch(mdPath).then(res => {
                if (!res.ok) throw new Error(`マークダウンファイルが見つかりません: ${res.statusText}`);
                return res.text();
            })
        ]);

        const jsonData = await metaResponse.json();
        const projectsList = jsonData.articles;
        let markdownText = markdownResponse;

        const projectMeta = projectsList.find(p => p.id === projectId);
        if (!projectMeta) {
            throw new Error('指定されたプロジェクトが見つかりませんでした。');
        }

        // 強調ワード
        const importantTags = ['二次利用禁止','三次利用禁止', 'バグあり', '試作品', '取扱注意'];
        
        const categoryMap = {
            "技術": "tech",
            "デザイン": "design",
            "DIY": "diy",
            "趣味": "hobby",
            "旅行": "travel",
        };

        // HTMLコンテンツを生成
        document.title = projectMeta.title + " | KamamasaStudio";

        let contentHTML = `
            <div class="project-header">
                <h1 class="project-title">${projectMeta.title}</h1>
                <div class="project-meta">
                    <span><i class="fa-solid fa-calendar-day"></i> 公開: ${projectMeta.publishDate}</span>
                    <span><i class="fa-solid fa-arrows-rotate"></i> 更新: ${projectMeta.updateDate}</span>
                </div>
                <div class="project-tech">
                    <div class="project-category">
        `;
        // カテゴリ要素を生成
        const extraClass = categoryMap[projectMeta.category] || "other";
        contentHTML = contentHTML + `
                        <div class="category-tag ${extraClass}">${projectMeta.category}</div>
                    </div>
                    <div class="project-tags">
                        ${(projectMeta.tags || []).map(tag => {
                            const isImportant = importantTags.includes(tag);
                            return `<span class="tech-tag ${isImportant ? 'important-tag' : ''}">${tag}</span>`;
                        }).join('')}
                    </div>
                </div>
            </div>
            <div id="markdown-content" class="markdown-content">
                <!-- マークダウンコンテンツがここに入る -->
            </div>
            <div class="back-button-container">
                <a href="projects.html" class="back-button">ノート一覧へ戻る</a>
            </div>
        `;
        
        loadingSpinner.style.display = 'none';
        mainContent.innerHTML = contentHTML;

        // マークダウンを変換
        if (markdownText) {
            //console.log("--- 1. Original Markdown Text ---");
            //console.log(markdownText.substring(0, 500)); // 全文だと長いので最初の500文字だけ表示
        
            //目次処理
            let processedMarkdown = processTableOfContents(markdownText);

           //console.log("--- 2. Markdown after TOC processing ---");
            //console.log(processedMarkdown.substring(0, 500)); // ★★★ このログが最重要！

            //コード見出しの記述
            processedMarkdown = processCustomCodeTitles(processedMarkdown);

            //ボタン記述
            processedMarkdown = parseCustomButtons(processedMarkdown);

            //本文変換
            const markdownContainer = document.getElementById('markdown-content');
            let htmlContent = marked.parse(processedMarkdown);
            
            // 見出しIDを後から追加
            htmlContent = addHeadingIds(htmlContent);
            
            markdownContainer.innerHTML = htmlContent;

            //コード部分配色
            Prism.highlightAllUnder(markdownContainer);
            
            // スムーズスクロール設定（DOM更新後に実行）
            setTimeout(() => {
                setupSmoothScroll();
            }, 200);
        }

    } catch (error) {
        console.error('詳細ページの表示に失敗しました:', error);
        loadingSpinner.style.display = 'none';
        mainContent.innerHTML = `
            <div class="error-state" style="text-align: center; color: #f87171;">
                <h2>コンテンツの読み込みに失敗しました</h2>
                <p>${error.message}</p>
                <div class="back-button-container">
                     <a href="notes.html" class="back-button">ノート一覧へ戻る</a>
                </div>
            </div>`;
    }
});