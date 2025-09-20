// 共通関数：左スクロール
function initRowScroll(containerId, speed = 1) {    
    const container = document.getElementById(containerId);
    const images = Array.from(container.children);
    const gap = 8; // CSSのgapと一致

    // 画像をコピーして無限化
    images.forEach(img => {
        const clone = img.cloneNode(true);
        container.appendChild(clone);
    });

    const allImages = Array.from(container.children);
    const totalWidth = allImages.reduce((sum, img) => sum + img.offsetWidth + gap, 0);
    let position = 0;

    function scroll() {
        position -= speed;
        if (position <= -totalWidth / 2) position = 0;
        container.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(scroll);
    }

    scroll();
}

// 共通関数：右スクロール
function initRowScrollReverse(containerId, speed = 1) {
    const container = document.getElementById(containerId);
    const images = Array.from(container.children);
    const gap = 8;

    // 画像をコピーして無限化
    images.forEach(img => {
        const clone = img.cloneNode(true);
        container.appendChild(clone);
    });

    const allImages = Array.from(container.children);
    const totalWidth = allImages.reduce((sum, img) => sum + img.offsetWidth + gap, 0);
    let position = -totalWidth / 2; // 右方向スタート

    function scroll() {
        position += speed;
        if (position >= 0) position = -totalWidth / 2;
        container.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(scroll);
    }

    scroll();
}

// ウィンドウロード後に初期化
window.addEventListener('load', () => {
    // 上段：左スクロール
    initRowScroll('scroll-top', 0.7);

    // 中段：右スクロール
    initRowScrollReverse('scroll-middle', 0.7);

    // 下段：左スクロール
    initRowScroll('scroll-bottom', 0.7);
});