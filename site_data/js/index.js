//固定ヘッダー表示処理
const fixedHeader = document.querySelector('.fixed-header');
const pageHeader = document.querySelector('.top-header');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fixedHeader.classList.remove('visible');
    } else {
      fixedHeader.classList.add('visible');
    }
  });
}, {
  root: null,
  threshold: 0,
});

observer.observe(pageHeader);

//ハンバーガーメニュー表示処理
const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('hamburger-menu');
const overlay = document.getElementById('menu-overlay');
const hamburger_close = document.getElementById('hamburger-close');

hamburger.addEventListener('click', () => {
  sideMenu.classList.toggle('open');
  overlay.classList.toggle('show');
  hamburger_close.classList.toggle('show');
});

const closeMenu = () => {
  sideMenu.classList.remove('open');
  overlay.classList.remove('show');
  hamburger_close.classList.remove('show');
};

hamburger_close.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);



// レスポンシブ対応: ウィンドウサイズ変更時の処理
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // メニューが開いている場合は閉じる
        if (window.innerWidth > 1000) {
            closeMenu();
        }
    }, 250);
});

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

        // ページ読み込み時に実行
        document.addEventListener('DOMContentLoaded', loadYouTubeVideos);