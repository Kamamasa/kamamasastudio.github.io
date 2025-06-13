// 音楽プレーヤー管理オブジェクト

let DefaultVolume = 1.00;

const MusicPlayer = {
    currentAudio: null,
    currentPlayerId: null,
    isDragging: false,
    dragTarget: null,
    tempvolume: 0.00,
    
    // 音楽プレーヤーHTMLを生成
    generatePlayerHTML(projectId, audioSrc) {
        return `
            <div class="music-player" data-player-id="${projectId}">
                <div class="player-controls">
                    <button class="control-button play-pause" onclick="MusicPlayer.togglePlay('${projectId}')">
                        <span class="play-icon fa-solid fa-play"></span>
                        <span class="pause-icon fa-solid fa-pause" style="display: none;"></span>
                    </button>
                    <button class="control-button stop fa-solid fa-stop" onclick="MusicPlayer.stop('${projectId}')"></button>
                    <div class="time-display">
                        <span class="current-time">00:00</span> / <span class="total-time">--:--</span>
                    </div>
                    <div class="seek-container">
                        <div class="seek-bar" 
                            onmousedown="MusicPlayer.startDrag(event, '${projectId}', 'seek')"
                            onclick="MusicPlayer.seek(event, '${projectId}')">
                            <div class="seek-bar-inner">
                                <div class="seek-bar-progress"></div>
                            </div>
                        </div>
                    </div>
                    <div class="volume-container">
                        <span class="volume-icon fa-solid fa-volume-high"></span>
                        <div class="volume-bar" 
                            onmousedown="MusicPlayer.startDrag(event, '${projectId}', 'volume')"
                            onclick="MusicPlayer.setVolume(event, '${projectId}')">
                            <div class="volume-bar-inner">
                                <div class="volume-bar-progress"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <audio src="${audioSrc}" preload="metadata"></audio>
            </div>
        `;
    },

    // プレーヤーの初期化
    initPlayer(playerId) {
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        if (!playerElement) return;

        const audio = playerElement.querySelector('audio');
        const totalTimeSpan = playerElement.querySelector('.total-time');

        audio.addEventListener('loadedmetadata', () => {
            if (audio.duration && isFinite(audio.duration)) {
                totalTimeSpan.textContent = this.formatTime(audio.duration);
            }
        });

        // 既にデータが読み込まれている場合にも対応
        // (キャッシュされている場合など)
        if (audio.readyState > 0 && audio.duration && isFinite(audio.duration)) {
             totalTimeSpan.textContent = this.formatTime(audio.duration);
        }

        const initialVolume = audio.volume;
        this.setVolumePercentage(playerId, initialVolume);
    },
    
    // 再生/一時停止の切り替え
    togglePlay(playerId) {
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const audio = playerElement.querySelector('audio');
        const playIcon = playerElement.querySelector('.play-icon');
        const pauseIcon = playerElement.querySelector('.pause-icon');
        const projectItem = playerElement.closest('.project-item');
        const iconbg = playerElement.querySelector('.control-button.play-pause');

        if (audio.paused) {
            //ほかプレーヤーでの再生の場合停止
            if (this.currentAudio && this.currentAudio !== audio) {
                this.stopAllPlayersExcept(playerId); // 新しいヘルパーメソッドを想定
            } else if (!this.currentAudio) {
                this.stopAll(); // すべて停止
            }

            
            audio.play().then(() => {
                if (audio.volume === 0 || audio.volume === 1) {
                    audio.volume = DefaultVolume; // デフォルト音量を設定
                }
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline';
                projectItem.classList.add('playing');
                iconbg.style.backgroundColor = 'rgb(0, 200, 0,0.8)';
                iconbg.style.color = 'rgb(50,50,50)';
                this.currentAudio = audio;
                this.currentPlayerId = playerId;
                this.updatePlayerUI(playerId);
            }).catch(error => {
                console.error('再生エラー:', error);
                alert('音声ファイルの再生に失敗しました。');
            });
        } else {
            audio.pause();
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
            projectItem.classList.remove('playing');
            if (iconbg) {
                iconbg.style.backgroundColor = 'rgba(0, 100, 0, 0.8)';
                iconbg.style.color = 'rgb(50,50,50)';
            }
        }
    },

    // 特定プレーヤー以外を停止
    stopAllPlayersExcept(exceptPlayerId) {
        document.querySelectorAll('.music-player').forEach(player => {
            const playerId = player.getAttribute('data-player-id');
            if (playerId !== exceptPlayerId) {
                this.stop(playerId); // stopメソッドを呼び出す
            }
        });
    },

    // 停止
    stop(playerId) {
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const audio = playerElement.querySelector('audio');
        const playIcon = playerElement.querySelector('.play-icon');
        const pauseIcon = playerElement.querySelector('.pause-icon');
        const projectItem = playerElement.closest('.project-item');
        const iconbg = playerElement.querySelector('.control-button.play-pause');
        
        audio.pause();
        audio.currentTime = 0;
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';

        projectItem.classList.remove('playing');
        
        // プログレスバーをリセット
        const progressBar = playerElement.querySelector('.seek-bar-progress');
        progressBar.style.width = '0%';

        //アイコン色初期化
        iconbg.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        iconbg.style.color = '#93C5FD';


        
        // 時間表示をリセット
        const currentTimeSpan = playerElement.querySelector('.current-time');
        currentTimeSpan.textContent = '0:00';
        
        if (this.currentPlayerId === playerId) {
            this.currentAudio = null;
            this.currentPlayerId = null;
        }
    },
    
    // 全ての音楽を停止
    stopAll() {
        document.querySelectorAll('.music-player').forEach(player => {
            const playerId = player.getAttribute('data-player-id');
            this.stop(playerId);
        });
    },
    
    // ドラッグ開始
    startDrag(event, playerId, type) {
        event.preventDefault();
        this.isDragging = true;
        this.dragTarget = { playerId, type, element: event.currentTarget };
        this.dragTarget.element.classList.add('dragging');
        
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const audio = playerElement.querySelector('audio');
        if (type === 'seek' && audio.volume > 0) {
            // 演出上シーク演出残してあるけど音量下げる
            this.tempvolume = audio.volume;
            this.setVolumePercentage(playerId, 0.25,false); 
        }

        this._boundMouseMove = this.handleDrag.bind(this);
        this._boundMouseUp = this.endDrag.bind(this);
        // ドラッグ中のイベントリスナーを追加
        document.addEventListener('mousemove', this._boundMouseMove);
        document.addEventListener('mouseup', this._boundMouseUp);

        // 初期位置を設定
        this.handleDrag(event);
    },

    // ドラッグ中の処理
    handleDrag(event) {
        if (!this.isDragging || !this.dragTarget) return;
        
        const { playerId, type, element } = this.dragTarget;
        const rect = element.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        
        if (type === 'seek') {
            this.seekToPercentage(playerId, percentage);
        } else if (type === 'volume') {
            this.setVolumePercentage(playerId, percentage);
        }
    },
    
    // ドラッグ終了
    endDrag() {
        document.removeEventListener('mousemove', this._boundMouseMove);
        document.removeEventListener('mouseup', this._boundMouseUp);
        if (!this.isDragging) return;


        if (this.isDragging && this.dragTarget) {
            this.dragTarget.element.classList.remove('dragging');
        }
        
        const { playerId, type } = this.dragTarget;
        if (type === 'seek') {
            this.setVolumePercentage(playerId, this.tempvolume,true);
        }
        

        this.isDragging = false;
        this.dragTarget = null;
        this._boundMouseMove = null;
        this._boundMouseUp = null;
    },
    
    // パーセンテージでシーク
    seekToPercentage(playerId, percentage) {
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const audio = playerElement.querySelector('audio');
        
        if (audio.duration) {
            audio.currentTime = audio.duration * percentage;
            // プログレスバーを即座に更新
            const progressBar = playerElement.querySelector('.seek-bar-progress');
            progressBar.style.width = (percentage * 100) + '%';
        }
    },
    
    // パーセンテージで音量設定
    setVolumePercentage(playerId, percentage,updateUI = true) {
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const audio = playerElement.querySelector('audio');
        const volumeProgress = playerElement.querySelector('.volume-bar-progress');
        const volumeIcon = playerElement.querySelector('.volume-icon');
        
        audio.volume = percentage;        

        // 音量アイコンの更新(updateUI true時)
        if (updateUI) {

            volumeProgress.style.width = (percentage * 100) + '%';
            if (audio.volume === 0) {
            volumeIcon.classList = 'volume-icon fa-solid fa-volume-xmark';
            } else if (audio.volume < 0.5) {
                volumeIcon.classList = 'volume-icon fa-solid fa-volume-low';
            } else {
                volumeIcon.classList = 'volume-icon fa-solid fa-volume-high';
            }
        }
    },
    
    // シークバーでの位置指定（クリック用）
    seek(event, playerId) {
        // ドラッグ中の場合はクリックイベントを無視
        if (this.isDragging) return;
        
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const audio = playerElement.querySelector('audio');
        const seekBar = event.currentTarget;
        const rect = seekBar.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        
        this.seekToPercentage(playerId, percentage);
    },
    
    // 音量設定（クリック用）
    setVolume(event, playerId) {
        // ドラッグ中の場合はクリックイベントを無視
        if (this.isDragging) return;
        
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const volumeBar = event.currentTarget;
        const rect = volumeBar.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        
        this.setVolumePercentage(playerId, percentage);
    },
    
    // プレーヤーUIの更新
    updatePlayerUI(playerId) {
        const playerElement = document.querySelector(`[data-player-id="${playerId}"]`);
        const audio = playerElement.querySelector('audio');
        const progressBar = playerElement.querySelector('.seek-bar-progress');
        const currentTimeSpan = playerElement.querySelector('.current-time');
        const totalTimeSpan = playerElement.querySelector('.total-time');
        
        const updateProgress = () => {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + '%';
                currentTimeSpan.textContent = this.formatTime(audio.currentTime);
                totalTimeSpan.textContent = this.formatTime(audio.duration);
            }
        };
        
        // 定期的な更新
        const interval = setInterval(() => {
            if (audio.paused || audio.ended) {
                clearInterval(interval);
                if (audio.ended) {
                    this.stop(playerId);
                }
                return;
            }
            // ドラッグ中でない場合のみプログレスバーを更新
            if (!this.isDragging || this.dragTarget?.type !== 'seek') {
                updateProgress();
            } else {
                // ドラッグ中でも時間表示は更新
                currentTimeSpan.textContent = this.formatTime(audio.currentTime);
            }
        }, 100);
                
        updateProgress();
    },
    
    // 時間フォーマット
    formatTime(seconds) {
        if (isNaN(seconds) || seconds === null) return '0:00';

        const totalSeconds = Math.floor(seconds);        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        
        return `${formattedMinutes}:${formattedSeconds}`;
    }
};

// ダウンロード機能
const DownloadManager = {
    generateDownloadHTML(projectId, audioPath, dlTypes) {
        const downloadOptions = dlTypes.split(',').map(type => {
            const cleanType = type.trim();
            const [format, note] = cleanType.split('(').map(s => s.replace(')', '').trim());
            const extension = format.toLowerCase();
            // 正規表現で拡張子を安全に置換
            let url = audioPath.replace(/\.[^/.]+$/, `.${extension}`);
            url += '?dl'; // ダウンロード用のクエリパラメータを追加
            return {
                label: format,
                note: note || '',
                url: url
            };
        });

        const selectedOption = downloadOptions[0];

        return `
            <div class="download-section" data-project-id="${projectId}">
                <div class="custom-dropdown" data-selected-url="${selectedOption.url}">
                    <div class="dropdown-selected" onclick="DownloadManager.toggleDropdown(event)">
                        <span class="selected-label">${selectedOption.label}</span>
                        <span class="selected-note">${selectedOption.note}</span>
                        <i class="fa-solid fa-chevron-down dropdown-caret"></i>
                    </div>
                    <div class="dropdown-options">
                        ${downloadOptions.map(option => `
                            <div class="dropdown-option" 
                                 data-url="${option.url}" 
                                 data-label="${option.label}" 
                                 data-note="${option.note}" 
                                 onclick="DownloadManager.selectOption(event)">
                                <span class="option-label">${option.label}</span>
                                <span class="option-note">${option.note}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="download-button" onclick="DownloadManager.downloadFile('${projectId}')">
                    <i class="fa-solid fa-download"></i> ダウンロード
                </button>
            </div>
        `;
    },

    toggleDropdown(event) {
        // currentTarget はイベントが設定された要素そのものを指す
        const dropdown = event.currentTarget.closest('.custom-dropdown');
        dropdown.classList.toggle('open');
    },

    selectOption(event) {
        const option = event.currentTarget;
        const dropdown = option.closest('.custom-dropdown');
        const selectedDisplay = dropdown.querySelector('.dropdown-selected');
        
        // 選択された内容をUIに反映
        selectedDisplay.querySelector('.selected-label').textContent = option.dataset.label;
        selectedDisplay.querySelector('.selected-note').textContent = option.dataset.note;
        
        // 選択されたURLを親要素のdata属性に保存しておく
        dropdown.dataset.selectedUrl = option.dataset.url;
        
        dropdown.classList.remove('open');
    },

    downloadFile(projectId) {
        const section = document.querySelector(`.download-section[data-project-id="${projectId}"]`);
        const dropdown = section.querySelector('.custom-dropdown');
        
        // data属性から直接URLを取得する
        const downloadUrl = dropdown.dataset.selectedUrl;

        if (!downloadUrl) {
            console.error('Download URL not found!');
            return;
        }

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = downloadUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    // 詳細ページボタンを生成
    generateDetailHTML(projectId, category) {
        return `
            <div class="detail-section">
                <button class="detail-button" onclick="DownloadManager.goToDetail('${projectId}', '${category}')">
                    <i class="fa-solid fa-info-circle"></i> 詳細を見る
                </button>
            </div>
        `;
    },

    // 詳細ページへ遷移
    goToDetail(projectId, category) {
        // 詳細ページのURLを生成（実際のURL構造に合わせて調整）
        const detailUrl = `detail.html?id=${projectId}&category=${category}`;
        window.open(detailUrl, '_self');
    }
};
document.addEventListener('click', function(event) {
    document.querySelectorAll('.custom-dropdown.open').forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('open');
        }
    });
});


// プロジェクトデータ読み込み
const projectsDataCache = {};
async function getCategoryData(category) {
    // すでにキャッシュにデータがあれば、それを返す
    if (projectsDataCache[category]) {
        console.log(`Using cached data for: ${category}`);
        return projectsDataCache[category];
    }

    console.log(`Fetching data for: ${category}`);
    const filePath = `../json/projects_list_${category}.json`;
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Data file not found for category: ${category}`);
                projectsDataCache[category] = [];
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        projectsDataCache[category] = data;
        
        return data;

    } catch (error) {
        console.error(`Failed to fetch project data for ${category}:`, error);
        return [];
    }
}


// プロジェクトリストを生成する関数

function generateProjectList(category, projects) {
    if (!projects || projects.length === 0) {
        return '<div class="empty-state"><div>Coming Soon...</div></div>';
    }

    return projects.map(project => {
        const projectId = project.id;
        
        const importantKeywords = ['二次利用禁止','三次利用禁止', 'バグあり', '試作品', '取扱注意'];

        const musicPlayer = category === 'music' && project.audioPath ? 
            MusicPlayer.generatePlayerHTML(projectId, project.audioPath) : '';
        
        let actionSection = '';
        if (category === 'music' && project.audioPath && project.dl_type) {
            actionSection = DownloadManager.generateDownloadHTML(projectId, project.audioPath, project.dl_type);
        } else if (category !== 'music') {
            actionSection = DownloadManager.generateDetailHTML(projectId, category);
        }
        
        return `
            <div class="project-item" data-project-id="${projectId}" id="${projectId}">
                <div class="project-main-content">
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        <div class="project-meta">
                            <span>公開: ${project.publishDate}</span>
                            <span>更新: ${project.updateDate}</span>
                        </div>
                        <div class="project-description">
                            ${project.description}
                        </div>
                        <div class="project-tech">
                            ${project.techStack.map(tech => {
                                const isImportant = importantKeywords.includes(tech);
                                const tagClass = isImportant ? 'tech-tag important-tag' : 'tech-tag';
                                return `<span class="${tagClass}">${tech}</span>`;
                            }).join('')}
                        </div>
                    </div>
                    
                    ${ category === 'music' ? 
                        `<div class="project-actions">
                            ${actionSection}
                         </div>` 
                        : ''
                    }
                </div>

                ${musicPlayer}

                ${ category !== 'music' ?
                    actionSection : ''
                }
            </div>
        `;
    }).join('');
}

// タブ切り替え機能
async function showTab(tabName) {
    // 音楽を停止
    MusicPlayer.stopAll();
    
    // 全てのタブコンテンツを非表示
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 全てのタブボタンを非アクティブ
    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });

    // 選択されたタブを表示
    const tabElement = document.getElementById(tabName);
    tabElement.classList.add('active');
    
    // プロジェクトリストを更新
    const projectListElement = tabElement.querySelector('.project-list');
    projectListElement.innerHTML = '<div class="loading-state"></div>';
    const projects = await getCategoryData(tabName);
    projectListElement.innerHTML = generateProjectList(tabName, projects);

    // 音楽プレイヤーの初期化処理
    const players = projectListElement.querySelectorAll('.music-player');
    players.forEach(player => {
        const playerId = player.getAttribute('data-player-id');
        if (playerId) {
            MusicPlayer.initPlayer(playerId);
        }
    });

    // 対応するタブボタンをアクティブに
    const activeButton = document.querySelector(`.tab-button.${tabName}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // タブボタンを表示範囲にスクロール（モバイル対応）
    activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}


// ページ読み込み時にデフォルトタブを設定
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await showTab('music'); // デフォルトで「音楽」タブを表示
    } catch (error) {
        console.error('初期タブの表示に失敗しました:', error);
        const initialContent = document.getElementById('music')?.querySelector('.project-list');
        if (initialContent) {
            initialContent.innerHTML = '<div class="error-state">コンテンツの読み込みに失敗しました。</div>';
        }
    }
});

// キーボードナビゲーション
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        const tabs = ['music', 'programming', 'game'];
        const currentTab = document.querySelector('.tab-content.active').id;
        const currentIndex = tabs.indexOf(currentTab);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            showTab(tabs[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
            e.preventDefault();
            showTab(tabs[currentIndex + 1]);
        }
    }
    
    // スペースキーで再生/一時停止
    if (e.code === 'Space' && MusicPlayer.currentPlayerId) {
        e.preventDefault();
        MusicPlayer.togglePlay(MusicPlayer.currentPlayerId);
    }
});