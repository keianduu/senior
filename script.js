console.log("楽天シニア プロトタイプ JS loaded");

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. 無限ループスライダーの実装 (物理ループ方式)
    // ---------------------------------------------------------
    const slider = document.getElementById('missionSlider');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (slider && dotsContainer) {
        // 元のスライド要素を取得
        const originalSlides = Array.from(slider.children);
        const slideCount = originalSlides.length; // 通常は3
        const dots = Array.from(dotsContainer.children);

        // コンテナを一度空にする
        slider.innerHTML = '';

        // 【設定】ループ回数（前後50セットずつ＝計100セットあればまず端には着きません）
        const loopCount = 100; 
        const centerSetIndex = Math.floor(loopCount / 2); // 真ん中のセット番号（50）

        // 大量に並べる
        for (let i = 0; i < loopCount; i++) {
            originalSlides.forEach(slide => {
                const clone = slide.cloneNode(true);
                slider.appendChild(clone);
            });
        }

        // レイアウト計算待ち
        setTimeout(() => {
            // スライド1枚の幅を取得（2枚目の位置 - 1枚目の位置）
            const firstSlide = slider.children[0];
            const secondSlide = slider.children[1];
            // もし取得できなければ中断
            if (!firstSlide || !secondSlide) return;
            
            const slideWidth = secondSlide.offsetLeft - firstSlide.offsetLeft;
            
            // 1セット分の幅
            const setWidth = slideWidth * slideCount;

            // ■ 初期位置設定
            // 真ん中のセットの先頭へジャンプ
            slider.scrollLeft = setWidth * centerSetIndex;

            // ■ スクロールイベント（ドットの表示更新のみ行う）
            slider.addEventListener('scroll', () => {
                // 中心にあるスライドのインデックスを計算
                const centerPos = slider.scrollLeft + slider.clientWidth / 2;
                const globalIndex = Math.floor(centerPos / slideWidth);
                
                // どのセットにいても、3で割った余りが本物のインデックス(0,1,2)になる
                const realIndex = globalIndex % slideCount;

                dots.forEach((dot, i) => {
                    if (i === realIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            });

        }, 100); // 確実に描画されるまで少し待つ
    }

    // ---------------------------------------------------------
    // 2. ポイント数に応じたアイコン変更ロジック
    // ---------------------------------------------------------
    const currentPoints = 0;
    updatePointStatus(currentPoints);
});

function updatePointStatus(pointValue) {
    const iconEl = document.getElementById("pointStatusIcon");
    const displayEl = document.getElementById("currentPointDisplay");
    if (!iconEl || !displayEl) return;
    displayEl.innerText = pointValue;
    let icon = "";
    let bgColor = "";
    if (pointValue < 10) {
        icon = "🥺"; bgColor = "#ECEFF1"; 
    } else if (pointValue < 20) {
        icon = "🙂"; bgColor = "#FFF3E0";
    } else {
        icon = "😆"; bgColor = "#FFEBEE"; 
    }
    iconEl.innerText = icon;
    iconEl.style.backgroundColor = bgColor;
}