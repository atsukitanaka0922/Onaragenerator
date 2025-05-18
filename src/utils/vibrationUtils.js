// src/utils/vibrationUtils.js
// 振動機能のユーティリティ関数

/**
 * デバイスが振動APIをサポートしているかどうかチェック
 * @returns {boolean} 振動APIが利用可能かどうか
 */
export const isVibrationSupported = () => {
  return 'vibrate' in navigator || 'mozVibrate' in navigator;
};

/**
 * デバイスを振動させる
 * @param {number|Array<number>} pattern - 振動パターン（ミリ秒）。
 *   - 数値の場合：その時間（ミリ秒）だけ振動
 *   - 配列の場合：[振動時間, 停止時間, 振動時間, ...] のパターンで振動
 * @returns {boolean} 振動APIが正常に呼び出されたかどうか
 */
export const vibrate = (pattern) => {
  try {
    // 振動APIをサポートしているか確認
    if (!isVibrationSupported()) {
      console.log('振動APIはサポートされていません');
      return false;
    }
    
    // APIを呼び出す（ブラウザによる実装の違いに対応）
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    } else if ('mozVibrate' in navigator) {
      navigator.mozVibrate(pattern);
    }
    
    return true;
  } catch (error) {
    console.error('振動APIの呼び出しに失敗しました', error);
    return false;
  }
};

/**
 * 振動をキャンセルする
 */
export const cancelVibration = () => {
  if (isVibrationSupported()) {
    navigator.vibrate(0);
  }
};

/**
 * おならの振動パターンを生成する
 * @param {string} type - 振動パターンのタイプ
 * @returns {Array<number>} 振動パターン
 */
export const getFartVibrationPattern = (type) => {
  switch (type) {
    case 'short':
      return [50]; // 短いおなら
    case 'medium':
      return [30, 20, 80]; // 中くらいのおなら
    case 'long':
      return [40, 30, 80, 30, 60]; // 長いおなら
    case 'explosive':
      return [20, 10, 20, 10, 60, 80]; // 爆発的なおなら
    case 'subtle':
      return [15, 10, 15]; // 控えめなおなら
    case 'random':
      // ランダムなパターンを選択
      const patterns = [
        [50], 
        [30, 20, 80], 
        [40, 30, 80, 30, 60], 
        [20, 10, 20, 10, 60, 80], 
        [15, 10, 15]
      ];
      return patterns[Math.floor(Math.random() * patterns.length)];
    default:
      return [50]; // デフォルトは短いおなら
  }
};

/**
 * 画面を振動させる効果を適用する
 * @param {HTMLElement} element - 振動させる要素
 * @param {string} intensity - 振動の強さ ('small', 'medium', 'large')
 * @param {number} duration - 振動の持続時間（ミリ秒）
 */
export const shakeScreen = (element = document.body, intensity = 'medium', duration = 500) => {
  // 振動の強さに応じてCSSアニメーションのパラメータを設定
  let amplitude;
  switch (intensity) {
    case 'small':
      amplitude = 3;
      break;
    case 'medium':
      amplitude = 5;
      break;
    case 'large':
      amplitude = 10;
      break;
    case 'explosive':
      amplitude = 15;
      break;
    default:
      amplitude = 5;
  }
  
  // 現在のtransformを保存（他のトランスフォームと競合しないように）
  const originalTransform = window.getComputedStyle(element).transform;
  const wasStatic = originalTransform === 'none';
  
  // アニメーションクラスを適用
  element.classList.add('screen-shake');
  
  // アニメーションのスタイルを動的に設定
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes screenShake {
      0% { transform: ${wasStatic ? '' : originalTransform + ' '}translate(0, 0); }
      25% { transform: ${wasStatic ? '' : originalTransform + ' '}translate(${amplitude/2}px, ${amplitude}px); }
      50% { transform: ${wasStatic ? '' : originalTransform + ' '}translate(-${amplitude}px, -${amplitude/2}px); }
      75% { transform: ${wasStatic ? '' : originalTransform + ' '}translate(${amplitude}px, -${amplitude}px); }
      100% { transform: ${wasStatic ? '' : originalTransform + ' '}translate(0, 0); }
    }
    
    .screen-shake {
      animation: screenShake ${duration/1000}s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;
  document.head.appendChild(styleElement);
  
  // アニメーション終了後にクラスと追加スタイルを削除
  setTimeout(() => {
    element.classList.remove('screen-shake');
    document.head.removeChild(styleElement);
    
    // 元のスタイルに戻す（アニメーション終了時に適切に戻らない場合の対策）
    if (wasStatic) {
      element.style.transform = '';
    } else {
      element.style.transform = originalTransform;
    }
  }, duration);
  
  return true;
};