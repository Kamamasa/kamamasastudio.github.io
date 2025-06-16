//ヘッダーフッター紐づけ処理
fetch("/site_data/html/part_header.html")
  .then((response) => response.text())
  .then((data) => document.querySelector("#header").innerHTML = data);
fetch("/site_data/html/part_footer.html")
  .then((response) => response.text())
  .then((data) => document.querySelector("#footer").innerHTML = data);

  function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// スクロール位置に応じてTOPボタンの表示を調整
window.addEventListener('scroll', function() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
    } else {
        backToTopBtn.style.opacity = '0.7';
    }
});

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
