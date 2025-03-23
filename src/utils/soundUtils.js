// src/utils/soundUtils.js を新規作成してください

// シンプルな効果音プレーヤー
let audioContext = null;

// オーディオコンテキストを初期化
export const initAudio = () => {
  try {
    // ユーザージェスチャの前に呼ばれた場合は、遅延初期化する
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      console.log('AudioContext initialized:', audioContext.state);
    }
    return audioContext;
  } catch (error) {
    console.error('Failed to initialize AudioContext:', error);
    return null;
  }
};

// シンプルに音を鳴らす関数
export const playSimpleSound = (soundUrl, volume = 0.5) => {
  // サウンドAPIの基本確認
  if (!window.Audio) {
    console.error('Audio API is not supported in this browser');
    return;
  }
  
  console.log(`Attempting to play sound: ${soundUrl}`);
  
  try {
    // シンプルなオーディオ要素を使う
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    
    // 読み込みと再生を行う
    audio.addEventListener('canplaythrough', () => {
      console.log(`Sound loaded, playing: ${soundUrl}`);
      const playPromise = audio.play();
      
      // Promiseをハンドリング（モダンブラウザ対応）
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing sound:', error);
        });
      }
    }, { once: true });
    
    // エラーハンドリング
    audio.addEventListener('error', (e) => {
      console.error('Error loading sound:', e);
    });
    
    // 5秒後にこのオーディオ要素を破棄（メモリリーク防止）
    setTimeout(() => {
      audio.src = '';
    }, 5000);
    
    return audio;
  } catch (error) {
    console.error('Failed to play sound:', error);
    return null;
  }
};

// デフォルトの効果音一覧
export const defaultSounds = [
  { id: 'pop1', url: '/sounds/pop1.mp3', name: 'ポップ1' },
  { id: 'pop2', url: '/sounds/pop2.mp3', name: 'ポップ2' },
  { id: 'pop3', url: '/sounds/pop3.mp3', name: 'ポップ3' }
];