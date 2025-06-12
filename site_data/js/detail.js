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

        const [metaResponse, markdownResponse] = await Promise.all([
            fetch(`../json/projects_list_${category}.json`),
            fetch(`../article/project_${category}/${projectId}.md`).then(res => {
                if (!res.ok) throw new Error(`マークダウンファイルが見つかりません: ${res.statusText}`);
                return res.text(); // テキストとして解決
            })
        ]);

        const projectsList = await metaResponse.json();
        const markdownText = markdownResponse; // 取得したテキストそのもの

        const projectMeta = projectsList.find(p => p.id === projectId);
        if (!projectMeta) {
            throw new Error('指定されたプロジェクトが見つかりませんでした。');
        }

        // HTMLコンテンツを生成
        const contentHTML = `
            <div class="project-header">
                <h1 class="project-title">${projectMeta.title}</h1>
                <div class="project-meta">
                    <span><i class="fa-solid fa-calendar-day"></i> 公開: ${projectMeta.publishDate}</span>
                    <span><i class="fa-solid fa-arrows-rotate"></i> 更新: ${projectMeta.updateDate}</span>
                </div>
                <div class="project-tech">
                    ${projectMeta.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div id="markdown-content" class="markdown-content">
                <!-- マークダウン本文がここに挿入される -->
            </div>
            <div class="back-button-container">
                <a href="projects.html" class="back-button">
                    <i class="fa-solid fa-arrow-left"></i> プロジェクト一覧へ戻る
                </a>
            </div>
        `;
        
        loadingSpinner.style.display = 'none';
        mainContent.innerHTML = contentHTML;

        // マークダウンをHTMLに変換して表示
        if (markdownText) {
            const markdownContainer = document.getElementById('markdown-content');
            markdownContainer.innerHTML = marked.parse(markdownText);
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