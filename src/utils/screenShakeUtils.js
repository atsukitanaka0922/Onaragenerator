// src/utils/screenShakeUtils.js (完全なコード)

// グローバル状態の管理
let activeShakeId = null;
let isInitialized = false;  // 初期化状態を追跡

/**
 * ライブラリの初期化
 * 起動時に一度だけ呼び出す
 */
export const initShake = () => {
  if (isInitialized) return;
  
  console.log('画面振動ライブラリを初期化しています...');
  
  // イベントリスナーのセットアップなど、必要な初期化を行う
  
  isInitialized = true;
  console.log('画面振動ライブラリの初期化が完了しました');
};

/**
 * 画面振動エフェクトを実行する関数
 * @param {Object} options - 振動オプション
 * @param {number} options.intensity - 振動の強さ (1-10)
 * @param {number} options.duration - 振動の持続時間 (ms)
 */
export const shakeScreen = (options = {}) => {
  try {
    // 初期化されていない場合は初期化する
    if (!isInitialized) {
      initShake();
    }
    
    // intensity が 0 以下の場合は振動しない
    if (options.intensity <= 0) {
      console.log('振動強度が0以下のため、振動をスキップします');
      return false;
    }
    
    console.log('画面振動開始:', options);
    
    // 既に振動中なら古い振動をキャンセル
    if (activeShakeId) {
      console.log('既存の振動をキャンセルします');
      clearTimeout(activeShakeId);
      resetScreenPosition(); 
    }
    
    // デフォルト値の設定
    const intensity = options.intensity || 5;
    const duration = options.duration || 500;
    
    // AppContainerを直接取得
    const appContainer = document.querySelector('.App, #root, body');
    if (!appContainer) {
      console.error('振動対象要素が見つかりません');
      return false;
    }
    
    console.log('振動対象要素:', appContainer);
    
    // 直接スタイルをクラス経由で適用
    const styleElement = document.createElement('style');
    styleElement.id = 'shake-animation-style';
    
    // キーフレームアニメーションの定義
    const keyframes = `
      @keyframes screenShake {
        0% { transform: translate(0, 0); }
        10% { transform: translate(${-intensity/2}px, ${intensity/2}px); }
        20% { transform: translate(${intensity}px, ${-intensity}px); }
        30% { transform: translate(${-intensity}px, 0); }
        40% { transform: translate(${intensity/2}px, ${intensity}px); }
        50% { transform: translate(${-intensity/2}px, ${-intensity/2}px); }
        60% { transform: translate(${intensity/3}px, ${intensity/3}px); }
        70% { transform: translate(${-intensity/3}px, ${intensity/2}px); }
        80% { transform: translate(${intensity/4}px, ${-intensity/4}px); }
        90% { transform: translate(${-intensity/4}px, 0); }
        100% { transform: translate(0, 0); }
      }
    `;
    
    styleElement.textContent = keyframes;
    document.head.appendChild(styleElement);
    
    // アニメーションを適用
    appContainer.style.animation = `screenShake ${duration}ms ease-in-out`;
    appContainer.style.animationFillMode = 'forwards';
    
    // アニメーション終了時に後処理
    activeShakeId = setTimeout(() => {
      resetScreenPosition();
    }, duration);
    
    console.log('画面振動が適用されました');
    return true;
  } catch (error) {
    console.error('画面振動の適用中にエラーが発生しました:', error);
    resetScreenPosition();
    return false;
  }
};

/**
 * 画面の位置をリセットする
 */
function resetScreenPosition() {
  try {
    // スタイル要素を削除
    const styleElement = document.getElementById('shake-animation-style');
    if (styleElement) {
      styleElement.remove();
    }
    
    // 振動対象要素のアニメーションをリセット
    const appContainer = document.querySelector('.App, #root, body');
    if (appContainer) {
      appContainer.style.animation = '';
    }
    
    // タイマーIDをリセット
    activeShakeId = null;
    
    console.log('画面位置がリセットされました');
  } catch (error) {
    console.error('画面位置のリセット中にエラーが発生しました:', error);
  }
}

/**
 * おならタイプに応じた振動パターンを返す
 * @param {string} type - 振動タイプ
 * @returns {Object} 振動設定オブジェクト
 */
export const getFartShakePattern = (type = 'medium') => {
  console.log(`振動パターンを取得: ${type}`);
  
  let pattern;
  switch (type) {
    case 'subtle':
      pattern = { intensity: 2, duration: 300 };
      break;
    case 'short':
      pattern = { intensity: 4, duration: 400 };
      break;
    case 'medium':
      pattern = { intensity: 6, duration: 500 };
      break;
    case 'long':
      pattern = { intensity: 8, duration: 700 };
      break;
    case 'explosive':
      pattern = { intensity: 10, duration: 800 };
      break;
    case 'random':
      const patterns = [
        { intensity: 2, duration: 300 },
        { intensity: 4, duration: 400 },
        { intensity: 6, duration: 500 },
        { intensity: 8, duration: 700 },
        { intensity: 10, duration: 800 }
      ];
      pattern = patterns[Math.floor(Math.random() * patterns.length)];
      break;
    default:
      pattern = { intensity: 6, duration: 500 };
      break;
  }
  
  console.log('選択された振動パターン:', pattern);
  return pattern;
};