console.log('index.js loaded');
//固定ヘッダー表示処理
const fixedHeader = document.querySelector('.fixed-header');
const pageHeader = document.querySelector('.top-header');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // ページヘッダーが画面に見えている → 固定ヘッダー非表示
      fixedHeader.classList.remove('visible');
    } else {
      // ページヘッダーが画面外 → 固定ヘッダー表示
      fixedHeader.classList.add('visible');
    }
  });
}, {
  root: null, // ビューポート
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

overlay.addEventListener('click', () => {
  sideMenu.classList.remove('open');
  overlay.classList.remove('show');
  hamburger_close.classList.remove('show');
});

hamburger_close.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    overlay.classList.remove('show');
    hamburger_close.classList.remove('show');
});