console.log("楽天シニア プロトタイプ JS loaded");

// スライダーの要素を取得
const slider = document.getElementById('missionSlider');
const dots = document.querySelectorAll('.dot');

// スクロールイベントを監視
slider.addEventListener('scroll', () => {
    // 現在のスクロール位置から、何枚目のスライドか計算 (0, 1, 2)
    const scrollLeft = slider.scrollLeft;
    const slideWidth = slider.clientWidth;
    const activeIndex = Math.round(scrollLeft / slideWidth);

    // ドットの表示を更新
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
});