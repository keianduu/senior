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

/* script.js */

// グローバル関数として定義（HTMLのonclickから呼ぶため）
window.openSurveyModal = function() {
    const modal = document.getElementById('modal-survey');
    const q1 = document.getElementById('survey-q1');
    const q2 = document.getElementById('survey-q2');
    const stepNum = document.getElementById('survey-step-num');

    if(modal) {
        modal.style.display = 'flex';
        // 状態リセット
        if(q1) q1.style.display = 'block';
        if(q2) q2.style.display = 'none';
        if(stepNum) stepNum.innerText = '1';
    } else {
        console.error("Survey Modal not found");
    }
};

window.nextSurveyStep = function(step) {
    if(step === 2) {
        document.getElementById('survey-q1').style.display = 'none';
        document.getElementById('survey-q2').style.display = 'block';
        document.getElementById('survey-step-num').innerText = '2';
    }
};

window.finishSurvey = function() {
    // モーダルを閉じる
    document.getElementById('modal-survey').style.display = 'none';
    
    // UI切り替え: アンケート -> クジ
    document.getElementById('survey-entry').style.display = 'none';
    const kujiBanner = document.getElementById('kuji-entry');
    kujiBanner.style.display = 'flex';
    
    // ユーザーへのフィードバック
    alert("5ポイント獲得しました！\n続いて「特選クジ」に挑戦できます！");
};

window.openKujiModal = function() {
    const modal = document.getElementById('modal-kuji');
    modal.style.display = 'flex';
    
    // 抽選アニメーションリセット
    document.getElementById('kuji-spinning').style.display = 'block';
    document.getElementById('kuji-result').style.display = 'none';
    
    // 2.5秒後に結果表示
    setTimeout(() => {
        document.getElementById('kuji-spinning').style.display = 'none';
        document.getElementById('kuji-result').style.display = 'block';
    }, 2500);
};

window.finishKujiUI = function() {
    // クジ -> 完了表示
    document.getElementById('kuji-entry').style.display = 'none';
    document.getElementById('kuji-done').style.display = 'flex';
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = 'none';
};

/* script.js 末尾に追加 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 厳選セレクション カルーセル制御 ---
    const track = document.getElementById('adCarouselTrack');
    const dots = document.querySelectorAll('.ad-dot');
    
    if (track && dots.length > 0) {
        let currentIndex = 0;
        const slideCount = dots.length;
        const slideInterval = 3000; // 3秒

        // スライド幅 + ギャップ (CSSと合わせる: 88vw + margin? 計算で取得推奨)
        // ここでは簡易的に要素の幅を取得して計算
        const updateSlidePosition = () => {
            const firstSlide = track.children[0];
            // スライド幅 + 右マージン(12px)
            // getComputedStyleで正確なマージンを取得しても良いが、固定値12pxと仮定
            const moveAmount = firstSlide.offsetWidth + 12; 
            
            track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;

            // ドット更新
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // 次へ進む
        const nextSlide = () => {
            currentIndex++;
            if (currentIndex >= slideCount) {
                currentIndex = 0;
            }
            updateSlidePosition();
        };

        // 自動再生開始
        let autoPlay = setInterval(nextSlide, slideInterval);

        // タッチ操作（簡易版）やクリックでの停止を入れるならここに記述
        // 今回は自動スライドのみ実装
        
        // リサイズ対応（幅が変わった時のズレ補正）
        window.addEventListener('resize', updateSlidePosition);
    }
});