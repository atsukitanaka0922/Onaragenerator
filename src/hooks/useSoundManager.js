import { useState, useEffect, useCallback } from 'react';

export function useSoundManager(isSoundOn) {
  const [sounds, setSounds] = useState([]);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  
  // すべての関数の宣言を先に行う
  // 効果音を削除する関数の定義
  const removeSound = useCallback((soundId) => {
    setSounds(prev => prev.filter(sound => sound.id !== soundId));
    
    // 現在選択中の効果音が削除された場合、選択をリセット
    if (currentSoundIndex === soundId) {
      setCurrentSoundIndex(0);
    }
    
    console.log(`効果音を削除しました: ID=${soundId}`);
  }, [currentSoundIndex]);
  
  // 効果音を設定する関数の定義
  const setCurrentSound = useCallback((soundId) => {
    setCurrentSoundIndex(soundId);
    console.log(`現在の効果音を設定しました: ID=${soundId}`);
  }, []);
  
  // AudioContextの初期化
  const initAudioContext = useCallback(() => {
    // ここは既存のコード
    if (audioContext) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const newContext = new AudioContext();
      console.log('AudioContext created:', newContext.state);
      
      // Safariなどのブラウザ対応
      if (newContext.state === 'suspended') {
        newContext.resume().then(() => {
          console.log('AudioContext resumed');
        });
      }
      
      setAudioContext(newContext);
      setIsAudioInitialized(true);
      return newContext;
    } catch (error) {
      console.error('AudioContext の初期化に失敗:', error);
      return null;
    }
  }, [audioContext]);
  
  // 以下は既存のコード...
  
  // デフォルトの効果音をロード関数
  const loadDefaultSounds = async () => {
    // 既存のコード
  };
  
  // 効果音ファイルを追加
  const addSound = async (file) => {
    // 既存のコード
  };
  
  // 効果音を再生
  const playSound = (soundId, volumeScale = 0.3) => {
    // 既存のコード
  };
  
  // 現在選択中の効果音を再生
  const playCurrentSound = (volumeScale = 0.3) => {
    // 既存のコード
  };
  
  // ランダムな効果音を再生
  const playRandomSound = (volumeScale = 0.3) => {
    // 既存のコード
  };
  
  // useEffectは最後にまとめる
  useEffect(() => {
    const handleInteraction = () => {
      const ctx = initAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('AudioContext resumed after interaction');
        });
      }
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchend', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchend', handleInteraction);
    };
  }, [initAudioContext]);
  
  // アプリ起動時に初期化を試みる
  useEffect(() => {
    initAudioContext();
  }, [initAudioContext]);
  
  // デフォルトの効果音をロード
  useEffect(() => {
    if (audioContext && isAudioInitialized) {
      loadDefaultSounds();
    }
  }, [audioContext, isAudioInitialized]);
  
  return {
    sounds,
    currentSoundIndex,
    addSound,
    playSound,
    playCurrentSound,
    playRandomSound,
    removeSound,
    setCurrentSound
  };
}