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
        const slideInterval = 6000; // 3秒

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
/* script.js 末尾に追加 */

/* script.js 末尾に追加 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 商品一覧 カテゴリフィルタリング機能 (トグル式) ---
    const filterButtons = document.querySelectorAll('.cat-chip');
    const productCards = document.querySelectorAll('#product-list .product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const isAlreadyActive = btn.classList.contains('active');
                let selectedCategory = 'all'; // デフォルトは全表示

                // 1. ボタンの状態更新
                // 一旦すべてのボタンからactiveを外す
                filterButtons.forEach(b => b.classList.remove('active'));

                if (isAlreadyActive) {
                    // すでにアクティブだったボタンを押した -> 解除 (何もしない = activeクラスなし = 全表示)
                    selectedCategory = 'all';
                } else {
                    // 非アクティブなボタンを押した -> アクティブにする & カテゴリ設定
                    btn.classList.add('active');
                    selectedCategory = btn.getAttribute('data-cat');
                }

                // 2. フィルタリング実行
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    // 'all' (選択なし) または カテゴリが一致する場合のみ表示
                    if (selectedCategory === 'all' || selectedCategory === cardCategory) {
                        card.style.display = ''; // CSSのデフォルト(flex)に戻す
                        // フェードインアニメーション
                        card.style.opacity = '0';
                        card.style.transition = 'opacity 0.3s';
                        setTimeout(() => card.style.opacity = '1', 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});

/* script.js (末尾のフィルタリング処理を更新) */

document.addEventListener('DOMContentLoaded', () => {
    // --- 商品一覧 カテゴリフィルタリング機能 (パラメータ連動 & トグル式) ---
    const filterButtons = document.querySelectorAll('.cat-chip');
    const productCards = document.querySelectorAll('#product-list .product-card');

    // フィルタリング実行関数
    const applyFilter = (category) => {
        // 1. ボタンの見た目更新
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-cat') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. カードの表示切り替え
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || !category || category === cardCategory) {
                card.style.display = ''; 
                card.style.opacity = '0';
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (filterButtons.length > 0 && productCards.length > 0) {
        
        // A. クリックイベント設定
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const isAlreadyActive = btn.classList.contains('active');
                // トグル動作: アクティブなら解除('all')、でなければそのカテゴリを選択
                const targetCategory = isAlreadyActive ? 'all' : btn.getAttribute('data-cat');
                
                applyFilter(targetCategory);
                
                // URLも更新したい場合はここで行いますが、今回は省略
            });
        });

        // B. 初期ロード時のパラメータ読み取り
        const urlParams = new URLSearchParams(window.location.search);
        const paramCategory = urlParams.get('category'); // ?category=food 等を取得

        if (paramCategory) {
            // パラメータがあればそのカテゴリでフィルタ実行
            applyFilter(paramCategory);
        } else {
            // なければ全表示 (デフォルトCSSのまま)
        }
    }
});