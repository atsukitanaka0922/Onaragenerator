import { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import './App.css';
import MainContainer from './components/MainContainer';
import ControlPanel from './components/ControlPanel';
import SettingsPanel from './components/SettingsPanel';
import SpawnPoint from './components/SpawnPoint';
import SpawnIndicator from './components/SpawnIndicator';
import { vibrate, getFartVibrationPattern, isVibrationSupported } from './utils/vibrationUtils';
import { shakeScreen, getFartShakePattern, initShake } from './utils/screenShakeUtils';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  touch-action: manipulation;
  -webkit-overflow-scrolling: none;
  overscroll-behavior: none;
  box-sizing: border-box;
`;

const StartScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 100;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 0.5rem;
`;

const StartButton = styled.button`
  padding: 15px 30px;
  font-size: 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const AutoFartButton = styled.button`
  background-color: ${props => props.isActive ? '#e74c3c' : '#2ecc71'};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

function App() {
  // 最後のインタラクション時刻を追跡するref
  const lastInteractionTimeRef = useRef(0);
  
  // エラー状態
  const [hasError, setHasError] = useState(false);
  
  // アプリケーション状態
  const [isStarted, setIsStarted] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isSettingSpawn, setIsSettingSpawn] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isCreatingSmoke, setIsCreatingSmoke] = useState(false);
  
  // 表示設定
  const [displaySettings, setDisplaySettings] = useState({
    showSmoke: true,    // 煙を表示するかどうか
    playSound: true,    // 音を鳴らすかどうか
    vibration: true,    // 振動させるかどうか
    screenShake: true,  // 画面振動（初期値はオン）
    screenShakeStrength: 'medium' // 画面振動の強さ（初期値は普通）
  });
  const [vibrationStrength, setVibrationStrength] = useState('medium'); // 振動の強さ: 'short', 'medium', 'long', 'explosive', 'subtle', 'random'
  
  // スポーン地点
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [nextSpawnId, setNextSpawnId] = useState(1);
  
  // スポーン地点の動作モード設定
  const [spawnMode, setSpawnMode] = useState('simultaneous'); // 'simultaneous', 'sequential', 'random', 'randomMix'
  const [currentSequentialIndex, setCurrentSequentialIndex] = useState(0); // 順番モード用のインデックス
  
  // 煙のエフェクト設定
  const [smokeSettings, setSmokeSettings] = useState({
    size: 50,
    count: 8,
    speed: 1.0,
    duration: 3.0,
    effectType: 'normal',
    burstInterval: 200, // 連続発射の間隔（ミリ秒）- 200msに短縮
    burstSpeed: 1.0,    // 連続発射の速度倍率
    options: {
      fade: true,
      gravity: false,
      pulsate: false,
      trail: false
    }
  });
  
  // 色設定
  const [colorSettings, setColorSettings] = useState({
    mainColor: '#ffeb3b', // 黄色
    subColor: '#ff9800', // オレンジ
    blendMode: 'gradient'
  });
  
  // 煙パーティクル
  const [particles, setParticles] = useState([]);

  // 効果音関連の状態
  const [selectedSoundUrl, setSelectedSoundUrl] = useState('/sounds/small1.mp3');
  const [selectedSoundGenre, setSelectedSoundGenre] = useState('medium');
  const [isRandomSoundInGenre, setIsRandomSoundInGenre] = useState(false);
  // ジャンルごとに効果音を分類
  const soundGenres = [
    {
      id: 'small',
      name: 'Small',
      description: '小さくて軽快な効果音'
    },
    {
      id: 'medium',
      name: 'Medium',
      description: '中程度の大きさの効果音'
    },
    {
      id: 'big',
      name: 'Big',
      description: '大きな効果音'
    },
    {
      id: 'dirty',
      name: 'Dirty',
      description: '汚めな効果音'
    },
    {
      id: 'sneaky',
      name: 'Sneaky',
      description: 'すかしっぺ'
    },
    {
      id: 'bath',
      name: 'Bath',
      description: 'お風呂っ屁'
    }
  ];

  // ジャンルごとの効果音のリスト（発射回数を追加）
  const [soundsByGenre, setSoundsByGenre] = useState({
    small: [
      { id: 'small1', url: '/sounds/small1.mp3', name: 'Small 1', burstCount: 1 },
      { id: 'small2', url: '/sounds/small2.mp3', name: 'Small 2', burstCount: 1 },
      { id: 'small3', url: '/sounds/small3.mp3', name: 'Small 3', burstCount: 1 },
      { id: 'small4', url: '/sounds/small4.mp3', name: 'Small 4', burstCount: 3 },
      { id: 'small5', url: '/sounds/small5.mp3', name: 'Small 5', burstCount: 3 },
      { id: 'small6', url: '/sounds/small6.mp3', name: 'Small 6', burstCount: 2 },
      { id: 'small7', url: '/sounds/small7.mp3', name: 'Small 7', burstCount: 2 },
      { id: 'small8', url: '/sounds/small8.mp3', name: 'Small 8', burstCount: 2 },
      { id: 'small9', url: '/sounds/small9.mp3', name: 'Small 9', burstCount: 1 },
      { id: 'small10', url: '/sounds/small10.mp3', name: 'Small 10', burstCount: 1 },
      { id: 'small11', url: '/sounds/small11.mp3', name: 'Small 11', burstCount: 1 },
      { id: 'small12', url: '/sounds/small12.mp3', name: 'Small 12', burstCount: 1 },
      { id: 'small13', url: '/sounds/small13.mp3', name: 'Small 13', burstCount: 1 },
      { id: 'small14', url: '/sounds/small14.mp3', name: 'Small 14', burstCount: 1 },
      { id: 'small15', url: '/sounds/small15.mp3', name: 'Small 15', burstCount: 2 }
    ],
    medium: [
      { id: 'medium1', url: '/sounds/medium1.mp3', name: 'Medium 1', burstCount: 1 },
      { id: 'medium2', url: '/sounds/medium2.mp3', name: 'Medium 2', burstCount: 1 },
      { id: 'medium3', url: '/sounds/medium3.mp3', name: 'Medium 3', burstCount: 2 },
      { id: 'medium4', url: '/sounds/medium4.mp3', name: 'Medium 4', burstCount: 2 },
      { id: 'medium5', url: '/sounds/medium5.mp3', name: 'Medium 5', burstCount: 1 },
      { id: 'medium6', url: '/sounds/medium6.mp3', name: 'Medium 6', burstCount: 2 },
      { id: 'medium7', url: '/sounds/medium7.mp3', name: 'Medium 7', burstCount: 2 },
      { id: 'medium8', url: '/sounds/medium8.mp3', name: 'Medium 8', burstCount: 1 },
      { id: 'medium9', url: '/sounds/medium9.mp3', name: 'Medium 9', burstCount: 1 },
      { id: 'medium10', url: '/sounds/medium10.mp3', name: 'Medium 10', burstCount: 2 },
      { id: 'medium12', url: '/sounds/medium11.mp3', name: 'Medium 11', burstCount: 1 },
      { id: 'medium13', url: '/sounds/medium12.mp3', name: 'Medium 12', burstCount: 1 },
      { id: 'medium14', url: '/sounds/medium13.mp3', name: 'Medium 13', burstCount: 2 },
      { id: 'medium15', url: '/sounds/medium14.mp3', name: 'Medium 14', burstCount: 1 },
      { id: 'medium16', url: '/sounds/medium15.mp3', name: 'Medium 15', burstCount: 1 },
      { id: 'medium17', url: '/sounds/medium16.mp3', name: 'Medium 16', burstCount: 2 }
    ],
    big: [
      { id: 'big1', url: '/sounds/big1.mp3', name: 'Big 1', burstCount: 3 },
      { id: 'big2', url: '/sounds/big2.mp3', name: 'Big 2', burstCount: 1 },
      { id: 'big3', url: '/sounds/big3.mp3', name: 'Big 3', burstCount: 1 },
      { id: 'big4', url: '/sounds/big4.mp3', name: 'Big 4', burstCount: 2 },
      { id: 'big5', url: '/sounds/big5.mp3', name: 'Big 5', burstCount: 1 },
      { id: 'big6', url: '/sounds/big6.mp3', name: 'Big 6', burstCount: 1 },
      { id: 'big7', url: '/sounds/big7.mp3', name: 'Big 7', burstCount: 1 },
      { id: 'big8', url: '/sounds/big8.mp3', name: 'Big 8', burstCount: 4 },
      { id: 'big9', url: '/sounds/big9.mp3', name: 'Big 9', burstCount: 1 },
      { id: 'big10', url: '/sounds/big10.mp3', name: 'Big 10', burstCount: 1 },
    ],
    dirty: [
      { id: 'dirty1', url: '/sounds/dirty1.mp3', name: 'dirty 1', burstCount: 1 },
      { id: 'dirty2', url: '/sounds/dirty2.mp3', name: 'dirty 2', burstCount: 1 },
      { id: 'dirty3', url: '/sounds/dirty3.mp3', name: 'dirty 3', burstCount: 1 },
      { id: 'dirty4', url: '/sounds/dirty4.mp3', name: 'dirty 4', burstCount: 2 },
      { id: 'dirty5', url: '/sounds/dirty5.mp3', name: 'dirty 5', burstCount: 3 },
      { id: 'dirty6', url: '/sounds/dirty6.mp3', name: 'dirty 6', burstCount: 3 },
      { id: 'dirty7', url: '/sounds/dirty7.mp3', name: 'dirty 7', burstCount: 2 },
      { id: 'dirty8', url: '/sounds/dirty8.mp3', name: 'dirty 8', burstCount: 4 },
      { id: 'dirty9', url: '/sounds/dirty9.mp3', name: 'dirty 9', burstCount: 2 },
      { id: 'dirty10', url: '/sounds/dirty10.mp3', name: 'dirty 10', burstCount: 3 },
      { id: 'dirty11', url: '/sounds/dirty11.mp3', name: 'dirty 11', burstCount: 2 },
      { id: 'dirty12', url: '/sounds/dirty12.mp3', name: 'dirty 12', burstCount: 3 },
      { id: 'dirty13', url: '/sounds/dirty13.mp3', name: 'dirty 13', burstCount: 2 },
      { id: 'dirty14', url: '/sounds/dirty14.mp3', name: 'dirty 14', burstCount: 1 }
    ],
    sneaky: [
      { id: 'sneaky1', url: '/sounds/sneaky1.mp3', name: 'Sneaky 1', burstCount: 1 },
      { id: 'sneaky2', url: '/sounds/sneaky2.mp3', name: 'Sneaky 2', burstCount: 1 },
      { id: 'sneaky3', url: '/sounds/sneaky3.mp3', name: 'Sneaky 3', burstCount: 1 },
      { id: 'sneaky4', url: '/sounds/sneaky4.mp3', name: 'Sneaky 4', burstCount: 1 }
    ],
    bath: [
      { id: 'bath1', url: '/sounds/bath1.mp3', name: 'Bath 1', burstCount: 1 },
      { id: 'bath2', url: '/sounds/bath2.mp3', name: 'Bath 2', burstCount: 1 },
      { id: 'bath3', url: '/sounds/bath3.mp3', name: 'Bath 3', burstCount: 1 }
    ]
  });
  
  // オートおなら関連の状態
  const [isAutoFartEnabled, setIsAutoFartEnabled] = useState(false);
  const [autoFartInterval, setAutoFartInterval] = useState(5); // 秒単位
  const [autoFartRandomPosition, setAutoFartRandomPosition] = useState(true);
  const [autoFartSoundOption, setAutoFartSoundOption] = useState('current'); // 'current', 'random', 'randomAll'
  const autoFartIntervalRef = useRef(null);

  // 初期化処理
  useEffect(() => {
    // ライブラリの初期化
    console.log('アプリケーションの初期化を行います...');
    
    try {
      // 画面振動ライブラリの初期化
      initShake();
    } catch (error) {
      console.error('振動ライブラリの初期化に失敗しました:', error);
    }
    
    console.log('アプリケーションの初期化が完了しました');
  }, []);

  // isCreatingSmoke の状態変化をモニタリング
  useEffect(() => {
    console.log(`煙生成処理フラグの状態変更: ${isCreatingSmoke}`);
  }, [isCreatingSmoke]);

  // 効果音の発射回数を更新する関数
  const updateSoundBurstCount = (genreId, soundId, newCount) => {
    // 深いコピーを作成して変更
    const updatedSoundsByGenre = JSON.parse(JSON.stringify(soundsByGenre));
    
    // 該当する効果音を検索して更新
    const sound = updatedSoundsByGenre[genreId]?.find(s => s.id === soundId);
    if (sound) {
      sound.burstCount = newCount;
      // 状態を更新
      setSoundsByGenre(updatedSoundsByGenre);
    }
  };
  
  // スポーン地点を追加
  const addSpawnPoint = (x, y) => {
    const newSpawnPoint = {
      id: nextSpawnId,
      x,
      y,
      color: colorSettings.mainColor, // デフォルトはメインカラー
      active: true                    // アクティブ状態を追加
    };
    
    setSpawnPoints([...spawnPoints, newSpawnPoint]);
    setNextSpawnId(nextSpawnId + 1);
    
    console.log(`スポーン地点を追加しました: ID=${newSpawnPoint.id}, x=${x}, y=${y}`);
    return newSpawnPoint.id;
  };
  
  // スポーン地点の位置を更新
  const updateSpawnPointPosition = (id, x, y) => {
    // 重要: スポーン地点が実際に存在するかを確認
    const pointExists = spawnPoints.some(point => point.id === id);
    if (!pointExists) {
      console.error(`ID ${id} のスポーン地点が見つかりません`);
      return;
    }
    
    // 座標が有効な数値であることを確認
    if (isNaN(x) || isNaN(y)) {
      console.error(`無効な座標が指定されました: x=${x}, y=${y}`);
      return;
    }
    
    // 現在のスポーン地点の配列をコピーして新しい配列を作成
    const updatedPoints = spawnPoints.map(point => 
      point.id === id ? { ...point, x, y } : point
    );
    
    // 新しい配列で状態を更新
    setSpawnPoints(updatedPoints);
    console.log(`スポーン地点の位置を更新しました: ID=${id}, x=${x}, y=${y}`);
  };
  
  // スポーン地点の色を更新
  const updateSpawnPointColor = (id, color) => {
    setSpawnPoints(spawnPoints.map(point => 
      point.id === id ? { ...point, color } : point
    ));
    console.log(`スポーン地点 ID=${id} の色を更新しました: ${color}`);
  };
  
  // スポーン地点のアクティブ状態を更新
  const updateSpawnPointActive = (id, active) => {
    setSpawnPoints(spawnPoints.map(point => 
      point.id === id ? { ...point, active } : point
    ));
    console.log(`スポーン地点 ID=${id} のアクティブ状態を更新しました: ${active}`);
  };
  
  // すべてのスポーン地点をアクティブ化
  const activateAllSpawnPoints = () => {
    setSpawnPoints(spawnPoints.map(point => ({ ...point, active: true })));
    console.log("すべてのスポーン地点をアクティブ化しました");
  };
  
  // すべてのスポーン地点を非アクティブ化
  const deactivateAllSpawnPoints = () => {
    setSpawnPoints(spawnPoints.map(point => ({ ...point, active: false })));
    console.log("すべてのスポーン地点を非アクティブ化しました");
  };
  
  // スポーン地点削除
  const removeSpawnPoint = (id) => {
    setSpawnPoints(spawnPoints.filter(point => point.id !== id));
    console.log(`スポーン地点を削除しました: ID=${id}`);
  };
  
  // すべてのスポーン地点を削除
  const removeAllSpawnPoints = () => {
    setSpawnPoints([]);
    console.log("すべてのスポーン地点を削除しました");
  };

  // スポーン地点をタップするための処理を追加
  const handleSpawnPointDrag = (id, x, y) => {
    console.log(`スポーン地点の移動: ID=${id}, x=${x}, y=${y}`);
    // 座標が有効な値かチェック
    if (isNaN(x) || isNaN(y)) {
      console.error('無効な座標が指定されました:', { id, x, y });
      return;
    }
    
    // 安全のため画面内に収める
    const safeX = Math.max(0, Math.min(window.innerWidth, x));
    const safeY = Math.max(0, Math.min(window.innerHeight, y));
    
    updateSpawnPointPosition(id, safeX, safeY);
  };

  // 煙パーティクルの追加
  const addParticle = (spawnX, spawnY, targetX, targetY, customColor = null) => {
    try {
      const newId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      
      // パーティクルの初期位置をスポーン地点に設定
      const newParticle = {
        id: newId,
        // スポーン地点の座標をパーティクルの初期位置にする
        x: spawnX,  
        y: spawnY,
        // 目標位置も保存
        targetX,
        targetY,
        // 追加のプロパティ
        size: smokeSettings.size * (0.8 + Math.random() * 0.4),
        opacity: 0.7,
        // カスタム色があれば使用、なければデフォルト色
        color: customColor || colorSettings.mainColor
      };
      
      console.log(`パーティクル追加: ID=${newId}, 開始=(${spawnX},${spawnY}), 目標=(${targetX},${targetY}), 色=${newParticle.color}`);
      
      // パーティクルを追加
      setParticles(prevParticles => [...prevParticles, newParticle]);
      
      // 一定時間後に自動的に削除
      setTimeout(() => {
        setParticles(prevParticles => prevParticles.filter(p => p.id !== newId));
      }, smokeSettings.duration * 1000);
      
      return newId;
    } catch (error) {
      console.error('パーティクル追加エラー:', error);
      return null;
    }
  };
  
  // 黄色い煙を作成（泡が弾けたときのエフェクト）- カスタム色対応
  const createYellowSmoke = (x, y, customColor = null) => {
    const smokeCount = 1 + Math.floor(Math.random() * 2); // 1〜2個の煙
    
    // 使用する色を決定（カスタム色があればそれを使用、なければ黄色）
    const smokeColor = customColor || '#ffff00';
    
    for (let i = 0; i < smokeCount; i++) {
      // 上方向にランダムな角度で上昇
      const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI/6;
      const distance = 20 + Math.random() * 30;
      
      // 煙の目標位置
      const smokeTargetX = x + Math.cos(angle) * distance;
      const smokeTargetY = y + Math.sin(angle) * distance;
      
      // 煙を追加（特殊なIDを付与して黄色い煙と識別）
      const smokeId = `yellow-smoke-${Date.now()}-${Math.random()}`;
      const smokePack = {
        id: smokeId,
        x,
        y,
        targetX: smokeTargetX,
        targetY: smokeTargetY,
        size: 20 + Math.random() * 20,
        opacity: 0.6,
        isYellowSmoke: true, // 特殊フラグを設定
        color: smokeColor // カスタム色を設定
      };
      
      // 煙を追加
      setParticles(prev => [...prev, smokePack]);
      
      // 短い時間で消える
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== smokeId));
      }, 800);
    }
  };

  // ジャンルからランダムに効果音を選択する関数
  const getRandomSoundFromGenre = (genreId) => {
    const sounds = soundsByGenre[genreId] || [];
    if (sounds.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * sounds.length);
    return sounds[randomIndex].url;
  };

  // オートおなら機能のトグル関数
  const toggleAutoFart = () => {
    if (!isAutoFartEnabled) {
      // オートおなら開始
      startAutoFart();
    } else {
      // オートおなら停止
      stopAutoFart();
    }
  };
  
  // オートおなら開始関数
  const startAutoFart = () => {
    if (autoFartIntervalRef.current) {
      clearInterval(autoFartIntervalRef.current);
    }

    // インターバルをセット
    autoFartIntervalRef.current = setInterval(() => {
      // スポーン地点がなければ何もしない
      if (spawnPoints.length === 0) return;

      // おならの発生位置を決定
      let targetX, targetY;
      
      if (autoFartRandomPosition) {
        // ランダムな位置
        targetX = Math.random() * window.innerWidth;
        targetY = Math.random() * window.innerHeight;
      } else {
        // 画面中央
        targetX = window.innerWidth / 2;
        targetY = window.innerHeight / 2;
      }

      // 効果音設定の適用 - ディープコピーで現在の値を保存
      const originalState = {
        soundUrl: selectedSoundUrl,
        soundGenre: selectedSoundGenre,
        randomInGenre: isRandomSoundInGenre
      };
      
      // 自動おならのサウンドオプションに基づいて一時的に設定を変更
      if (autoFartSoundOption === 'random') {
        // 現在のジャンルからランダム選択を有効にする
        setIsRandomSoundInGenre(true);
      } else if (autoFartSoundOption === 'randomAll') {
        // 全ジャンルからランダム
        const allGenres = Object.keys(soundsByGenre);
        if (allGenres.length > 0) {
          // 実際にランダムなジャンルを選択
          const randomGenre = allGenres[Math.floor(Math.random() * allGenres.length)];
          console.log(`自動おなら: ランダムジャンル「${randomGenre}」を選択`);
          
          // ジャンルを変更
          setSelectedSoundGenre(randomGenre);
          
          // ランダム再生を有効化
          setIsRandomSoundInGenre(true);
        }
      }

      // 少し遅延させてからおならを発生させる（状態更新が反映されるのを待つ）
      setTimeout(() => {
        // おならを発生させる（既存のスポーンモード機能を利用）
        createSmokeBurst(targetX, targetY);
        
        // 効果音設定を元に戻す（少し遅延させる）
        setTimeout(() => {
          setSelectedSoundUrl(originalState.soundUrl);
          setSelectedSoundGenre(originalState.soundGenre);
          setIsRandomSoundInGenre(originalState.randomInGenre);
        }, 500);
      }, 50);
      
    }, autoFartInterval * 1000);
    
    // 状態を更新
    setIsAutoFartEnabled(true);
  };

  // オートおなら停止関数
  const stopAutoFart = () => {
    if (autoFartIntervalRef.current) {
      clearInterval(autoFartIntervalRef.current);
      autoFartIntervalRef.current = null;
    }
    setIsAutoFartEnabled(false);
  };
  
  // メイン画面のクリックイベント処理関数 - 待機時間を短縮
  const handleInteraction = (x, y) => {
    console.log(`メイン画面のインタラクション: x=${x}, y=${y}`);
    
    // 処理中フラグが立っているが、前回の処理から一定時間経過している場合はリセット
    if (isCreatingSmoke) {
      const now = Date.now();
      const lastInteractionTime = lastInteractionTimeRef.current || 0;
      
      // 1秒以上経過していればフラグをリセット（3秒から1秒に変更）
      if (now - lastInteractionTime > 1000) {
        console.log('前回の処理から1秒以上経過しているため、処理フラグをリセットします');
        setIsCreatingSmoke(false);
      } else {
        console.log('処理中のため、新しいリクエストをスキップします');
        return; // 処理中なら何もしない
      }
    }
    
    // 現在時刻を記録
    lastInteractionTimeRef.current = Date.now();
    
    // おなら生成処理を呼び出す
    createSmokeBurst(x, y);
  };

  // 煙のバースト生成 - 表示設定対応バージョン
  const createSmokeBurst = (x, y) => {
    // 既に実行中なら処理しない
    if (isCreatingSmoke) {
      console.log('煙生成処理中のため、リクエストをスキップします');
      return;
    }
    
    console.log(`おなら発生: 目標位置 x=${x}, y=${y}, 設定:`, displaySettings);
    
    // 処理中フラグを立てる
    setIsCreatingSmoke(true);
    
    try {
      // 振動機能の処理
      if (displaySettings.vibration && isVibrationSupported()) {
        const pattern = getFartVibrationPattern(vibrationStrength);
        vibrate(pattern);
        console.log(`デバイス振動パターン: ${pattern}`);
      }
      
      // 画面振動機能の処理 - 簡略化
      if (displaySettings.screenShake) {
        console.log('画面振動を実行...');
        const shakePattern = getFartShakePattern(displaySettings.screenShakeStrength || 'medium');
        shakeScreen(shakePattern);
      }
      
      // 効果音再生
      if (displaySettings.playSound && isSoundOn) {
        try {
          // ジャンル内でランダム再生がオンの場合
          let soundUrl;
          if (isRandomSoundInGenre) {
            // ランダムな効果音を選択
            const sounds = soundsByGenre[selectedSoundGenre] || [];
            if (sounds.length > 0) {
              const randomIndex = Math.floor(Math.random() * sounds.length);
              soundUrl = sounds[randomIndex].url;
            }
          } else {
            soundUrl = selectedSoundUrl;
          }
          
          if (soundUrl) {
            console.log(`効果音を再生: ${soundUrl}`);
            const audio = new Audio(soundUrl);
            audio.volume = 0.5;
            audio.play().catch(e => console.log('効果音再生エラー:', e));
          }
        } catch (e) {
          console.log('効果音の処理中にエラー:', e);
        }
      }
      
      // 煙表示がオフの場合は、ここで処理を終了
      if (!displaySettings.showSmoke) {
        console.log('煙表示は無効です。スキップします');
        setTimeout(() => {
          setIsCreatingSmoke(false);
        }, 300);
        return;
      }

      // 以下、煙表示ありの場合の処理
      // 有効なスポーン地点をフィルタリング
      const activeSpawnPoints = spawnPoints.filter(point => point.active !== false);
      
      // スポーン地点がない場合は緊急追加
      if (activeSpawnPoints.length === 0) {
        const id = addSpawnPoint(window.innerWidth / 2, window.innerHeight - 100);
        console.log(`緊急スポーン地点が追加されました: ID=${id}`);
        
        // 次回の処理のために処理中フラグを解除
        setIsCreatingSmoke(false);
        return;
      }
      
      // ここから先は元の処理 - スポーンモードに基づいて...以降のコード
      // スポーンモードに基づいて使用するスポーン地点を選択
      let spawnPointsToUse = [];
        
      switch (spawnMode) {
        case 'simultaneous':
          // 全てのアクティブなスポーン地点を使用
          spawnPointsToUse = activeSpawnPoints;
          break;
          
        case 'sequential':
          // 順番にスポーン地点を使用
          if (activeSpawnPoints.length > 0) {
            // 現在のインデックスが範囲外ならリセット
            if (currentSequentialIndex >= activeSpawnPoints.length) {
              setCurrentSequentialIndex(0);
            }
            
            spawnPointsToUse = [activeSpawnPoints[currentSequentialIndex]];
            
            // 次のインデックスに更新
            setCurrentSequentialIndex((currentSequentialIndex + 1) % activeSpawnPoints.length);
          }
          break;
          
        case 'random':
          // ランダムに1つのスポーン地点を選択
          if (activeSpawnPoints.length > 0) {
            const randomIndex = Math.floor(Math.random() * activeSpawnPoints.length);
            spawnPointsToUse = [activeSpawnPoints[randomIndex]];
          }
          break;
          
        case 'randomMix':
          // ランダムに1～全部のスポーン地点を選択
          if (activeSpawnPoints.length > 0) {
            // 各スポーン地点を50%の確率で選択
            spawnPointsToUse = activeSpawnPoints.filter(() => Math.random() > 0.5);
            
            // 何も選ばれなかった場合は1つだけランダムに選択
            if (spawnPointsToUse.length === 0) {
              const randomIndex = Math.floor(Math.random() * activeSpawnPoints.length);
              spawnPointsToUse = [activeSpawnPoints[randomIndex]];
            }
          }
          break;
          
        default:
          spawnPointsToUse = activeSpawnPoints;
      }
        
      console.log(`使用するスポーン地点: ${spawnPointsToUse.length}箇所`);
        
      // 発射回数を決定
      let burstCount = 1; // デフォルトは1回
        
      try {
        if (isSoundOn && displaySettings.playSound) {
          if (isRandomSoundInGenre) {
            // ランダムな効果音を選択
            const sounds = soundsByGenre[selectedSoundGenre] || [];
            if (sounds.length > 0) {
              const randomIndex = Math.floor(Math.random() * sounds.length);
              const selectedSound = sounds[randomIndex];
                
              // 発射回数を更新
              burstCount = selectedSound.burstCount || 1; // undefined の場合は 1 にする
            }
          } else {
            // 選択中の効果音を検索
            const currentSounds = soundsByGenre[selectedSoundGenre] || [];
            const selectedSound = currentSounds.find(s => s.url === selectedSoundUrl);
                
            // 効果音が見つかれば、その発射回数を使用
            if (selectedSound) {
              burstCount = selectedSound.burstCount || 1; // undefined の場合は 1 にする
            }
          }
        }
      } catch (e) {
        console.log('発射回数の決定中にエラー:', e);
        burstCount = 1; // エラー時はデフォルト値に
      }
        
      console.log(`おなら発射回数: ${burstCount}回`);

      // ここに実際の煙パーティクル生成コードを書く
      // 発射回数分ループして煙を生成
      for (let burstIndex = 0; burstIndex < burstCount; burstIndex++) {
        // 各発射に少し遅延を加える（burstIntervalを使用）
        setTimeout(() => {
          const particleCount = Math.min(smokeSettings.count, 15); // 上限15個
          
          // 連続発射の速度倍率を適用するための値を計算
          const burstSpeed = smokeSettings.burstSpeed || 1.0;
          
          // 選択されたスポーン地点ごとの処理
          spawnPointsToUse.forEach(spawn => {
            // スポーン地点の色を取得（設定されていなければメインカラー）
            const spawnColor = spawn.color || colorSettings.mainColor;
            
            // エフェクトタイプに基づいて処理
            switch (smokeSettings.effectType) {
              case 'explosion':
                // 爆発エフェクト
                console.log(`スポーン地点 ${spawn.id} から爆発エフェクトを生成`);
                for (let i = 0; i < particleCount; i++) {
                  // 360度全方向にランダムな角度で発射
                  const angle = Math.random() * Math.PI * 2;
                  const distance = 100 + Math.random() * 200; // ランダムな距離
                  
                  const targetX = spawn.x + Math.cos(angle) * distance;
                  const targetY = spawn.y + Math.sin(angle) * distance;
                  
                  setTimeout(() => {
                    addParticle(spawn.x, spawn.y, targetX, targetY, spawnColor);
                  }, i * (30 / burstSpeed)); // burstSpeedで遅延時間を調整
                }
                break;
                
              case 'spiral':
                // 螺旋エフェクト
                console.log(`スポーン地点 ${spawn.id} から螺旋エフェクトを生成`);
                
                // 基本的な方向を計算
                const baseAngle = Math.atan2(y - spawn.y, x - spawn.x);
                
                for (let i = 0; i < particleCount; i++) {
                  // 螺旋状に角度を変化させる
                  const spiralAngle = baseAngle + (i / particleCount) * Math.PI * 2;
                  const distance = 50 + i * 15; // 徐々に大きくなる距離
                  
                  const targetX = spawn.x + Math.cos(spiralAngle) * distance;
                  const targetY = spawn.y + Math.sin(spiralAngle) * distance;
                  
                  setTimeout(() => {
                    addParticle(spawn.x, spawn.y, targetX, targetY, spawnColor);
                  }, i * (80 / burstSpeed)); // burstSpeedで遅延時間を調整
                }
                break;
                
              case 'fountain':
                // 噴水エフェクト
                console.log(`スポーン地点 ${spawn.id} から噴水エフェクトを生成`);
                for (let i = 0; i < particleCount; i++) {
                  // 上方向を中心にしたランダムな角度（-45度〜+45度）
                  const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI/2;
                  const distance = 150 + Math.random() * 200; // ランダムな距離
                  
                  const targetX = spawn.x + Math.cos(angle) * distance;
                  const targetY = spawn.y + Math.sin(angle) * distance;
                  
                  setTimeout(() => {
                    addParticle(spawn.x, spawn.y, targetX, targetY, spawnColor);
                  }, i * (60 / burstSpeed)); // burstSpeedで遅延時間を調整
                }
                break;
                
              case 'ring':
                // リングエフェクト
                console.log(`スポーン地点 ${spawn.id} からリングエフェクトを生成`);
                for (let i = 0; i < particleCount; i++) {
                  // 円周上に均等に配置
                  const angle = (i / particleCount) * Math.PI * 2;
                  const distance = 100; // 固定距離
                  
                  const targetX = spawn.x + Math.cos(angle) * distance;
                  const targetY = spawn.y + Math.sin(angle) * distance;
                  
                  // 全て同時に発射
                  addParticle(spawn.x, spawn.y, targetX, targetY, spawnColor);
                }
                break;
                
              case 'bubble':
                // 泡エフェクト - スポーン地点からのみ上昇するように修正
                // カスタム色を設定して泡エフェクトを生成
                console.log('泡エフェクトを生成');
                for (let i = 0; i < particleCount; i++) {
                  // 上昇角度をランダムに（垂直方向を中心に少しずれる）
                  const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI/4;
                  
                  // 上昇距離をランダムに
                  const distance = 100 + Math.random() * 150;
                  
                  // 目標位置を計算
                  const bubbleTargetX = spawn.x + (Math.random() * 40 - 20); // 小さな左右の揺れ
                  const bubbleTargetY = spawn.y - distance; // 上方向に移動（Y座標は上が小さくなる）
                  
                  // 泡パーティクルを追加
                  const bubbleParticle = {
                    id: `bubble-${Date.now()}-${Math.random()}`,
                    x: spawn.x,
                    y: spawn.y,
                    targetX: bubbleTargetX,
                    targetY: bubbleTargetY,
                    size: smokeSettings.size * (0.8 + Math.random() * 0.4),
                    opacity: 0.7,
                    isBubble: true, // 泡フラグ
                    popTime: smokeSettings.duration * 1000 * (0.3 + Math.random() * 0.4),
                    duration: smokeSettings.duration,
                    color: spawnColor
                  };
                  
                  // パーティクルリストに追加
                  setParticles(prev => [...prev, bubbleParticle]);
                  
                  // 一定時間後に削除
                  setTimeout(() => {
                    setParticles(prev => prev.filter(p => p.id !== bubbleParticle.id));
                  }, smokeSettings.duration * 1000);
                }
                break;

                case 'cloud':
                // 霧状エフェクト
                console.log('霧状エフェクトを生成');
                // 霧の層数
                const layerCount = smokeSettings.options.trail ? 5 : 3;
                const particlesPerLayer = Math.ceil(particleCount / layerCount);
                
                // 各層ごとに処理
                for (let layer = 0; layer < layerCount; layer++) {
                  // 各層ごとにパーティクルを放射状に配置
                  for (let i = 0; i < particlesPerLayer; i++) {
                    // 円周上に均等に配置
                    const angle = (i / particlesPerLayer) * Math.PI * 2;
                    
                    // 層ごとにサイズを変える（内側の層ほど小さく）
                    const layerSizeFactor = 0.7 + (layer / layerCount * 0.6);
                    
                    // 距離も層ごとに変える（外側の層ほど遠く）
                    const distance = smokeSettings.size * (0.5 + layer * 0.5);
                    
                    // 目標位置の計算
                    const cloudTargetX = spawn.x + Math.cos(angle) * distance;
                    
                    // 上昇効果（gravityオプションが有効なら）
                    const riseEffect = smokeSettings.options.gravity ? -50 - layer * 20 : 0;
                    const cloudTargetY = spawn.y + Math.sin(angle) * distance + riseEffect;
                    
                    // 霧パーティクルを追加
                    const cloudId = `cloud-${Date.now()}-${Math.random()}`;
                    const cloudParticle = {
                      id: cloudId,
                      x: spawn.x,
                      y: spawn.y, 
                      targetX: cloudTargetX,
                      targetY: cloudTargetY,
                      size: smokeSettings.size * layerSizeFactor * (0.7 + Math.random() * 0.6),
                      opacity: smokeSettings.options.fade ? 0.9 : 0.6, // fadeオプションで濃度調整
                      isCloud: true, // 特殊フラグを設定
                      blurAmount: smokeSettings.options.pulsate ? 10 : 5, // pulsateオプションでぼかし調整
                      color: spawnColor
                    };
                    
                    // 霧を追加
                    setParticles(prev => [...prev, cloudParticle]);
                    
                    // 一定時間後に削除
                    setTimeout(() => {
                      setParticles(prev => prev.filter(p => p.id !== cloudId));
                    }, smokeSettings.duration * 1000);
                  }
                }
                break;
                
              case 'normal':
              default:
                // 通常エフェクト
                console.log(`スポーン地点 ${spawn.id} から通常エフェクトを生成: (${spawn.x}, ${spawn.y}) → 目標: (${x}, ${y})`);
                
                for (let i = 0; i < particleCount; i++) {
                  // タップ位置周辺にバラけさせる
                  const offsetX = x + (Math.random() * 60 - 30);
                  const offsetY = y + (Math.random() * 60 - 30);
                  
                  // 少し遅延させて生成（連続発射速度を適用）
                  setTimeout(() => {
                    // スポーン地点から発生し、タップした位置の周辺を目標とする
                    addParticle(spawn.x, spawn.y, offsetX, offsetY, spawnColor);
                  }, i * (20 / burstSpeed)); // burstSpeedで遅延時間を調整
                }
                break;
            }
          });
        }, burstIndex * (smokeSettings.burstInterval || 200)); // 設定された発射間隔を使用
      }
    } catch (error) {
      console.error('おなら生成エラー:', error);
      setHasError(true);
    } finally {
      // 処理中フラグを解除 - 短縮版
      const baseDelay = 400; // ベースの遅延時間を短縮
      const burstDelay = (smokeSettings.burstInterval || 200) * (burstCount || 1);
      
      // 最大1000msに制限
      const delayTime = Math.min(1000, Math.max(baseDelay, burstDelay));
      
      console.log(`煙生成処理フラグのリセット予定時間: ${delayTime}ms`);
      
      setTimeout(() => {
        setIsCreatingSmoke(false);
        console.log('煙生成処理フラグをリセットしました');
      }, delayTime);
    }
  };

  // アプリケーション開始
  const startApp = () => {
    setIsStarted(true);
    console.log("アプリを開始しました");
    
    // 初期スポーン地点を追加
    addSpawnPoint(window.innerWidth / 2, window.innerHeight - 100);
  };
  
  // デバッグ用: エフェクト設定の変更を監視
  useEffect(() => {
    console.log('エフェクト設定が変更されました:', smokeSettings.effectType);
  }, [smokeSettings.effectType]);
  
  // コンポーネントアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (autoFartIntervalRef.current) {
        clearInterval(autoFartIntervalRef.current);
      }
    };
  }, []);
  
  // エラー発生時の表示
  if (hasError) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#f8d7da',
        color: '#721c24'
      }}>
        <h2>エラーが発生しました</h2>
        <p>アプリを再起動してください</p>
        <button 
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
          onClick={() => window.location.reload()}
        >
          再読み込み
        </button>
      </div>
    );
  }

return (
    <AppContainer>
      {!isStarted ? (
        <StartScreen>
          <Title>おならじぇねれーたー</Title>
          <Description>画面をタップしてかわいいあの子におならを発生させよう！</Description>
          <Description>⚙️ボタンで背景とおならの詳細設定、📍ボタンでおならの発生地点を設定できます</Description>
          <StartButton onClick={startApp}>スタート</StartButton>
        </StartScreen>
      ) : (
        <>
          <MainContainer 
            backgroundImage={backgroundImage}
            onInteraction={handleInteraction}
            isSettingSpawn={isSettingSpawn}
          >
            {/* スポーン地点 - SpawnPointコンポーネントを使用 */}
            {spawnPoints.map(point => (
              <SpawnPoint
                key={point.id}
                id={point.id}
                x={point.x}
                y={point.y}
                color={point.color || '#FF5722'}
                isActive={point.active !== false}
                isVisible={isSettingSpawn}
                isDraggable={isSettingSpawn}
                onPositionChange={handleSpawnPointDrag}
              />
            ))}
            
            {/* 煙パーティクル */}
            {particles.map(particle => (
              <div
                key={particle.id}
                id={`particle-${particle.id}`}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  // 泡の場合は特殊なスタイル
                  ...(particle.isBubble ? {
                    backgroundColor: 'transparent',
                    borderRadius: '50%',
                    boxShadow: `0 0 10px rgba(255, 255, 255, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)`,
                    background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))`,
                    opacity: particle.opacity || 0.7,
                  } : {
                    backgroundColor: particle.isYellowSmoke ? (particle.color || '#ffff00') : (particle.color || colorSettings.mainColor),
                    borderRadius: '50%',
                    opacity: particle.opacity || 0.7,
                    filter: particle.isCloud 
                      ? `blur(${particle.blurAmount || 5}px)` 
                      : particle.isYellowSmoke 
                        ? 'blur(8px)'
                        : 'blur(5px)',
                  }),
                  // 初期位置をスポーン地点に設定
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  transform: 'translate(-50%, -50%)',
                  transition: `all ${particle.duration || smokeSettings.duration}s ease-out`,
                  zIndex: 10
                }}
                className={particle.isBubble ? 'bubble-particle' : ''}
                // 要素が表示されたら目標位置に移動するアニメーションを開始
                ref={el => {
                  if (el) {
                    setTimeout(() => {
                      // 目標位置への移動（すべてのタイプに共通）
                      el.style.left = `${particle.targetX}px`;
                      el.style.top = `${particle.targetY}px`;
                      
                      // タイプごとの特殊な処理
                      if (particle.isBubble) {
                        // 泡の揺れるアニメーション
                        el.style.animation = `bubble-wobble ${1 + Math.random()}s ease-in-out infinite alternate`;
                        el.style.animationDelay = `${Math.random() * 0.5}s`;
                        
                        // 泡が弾けるタイミングが設定されていなければデフォルトのフェードアウト
                        if (!particle.popTime) {
                          el.style.opacity = '0';
                        }
                      } else if (particle.isCloud) {
                        // 霧状エフェクト
                        el.style.transform = 'translate(-50%, -50%) scale(1.8)';
                        el.style.opacity = '0';
                      } else if (particle.isYellowSmoke) {
                        // 黄色い煙エフェクト
                        el.style.transform = 'translate(-50%, -50%) scale(2)';
                        el.style.opacity = '0';
                      } else {
                        // 通常の煙エフェクト（既存の処理）
                        el.style.opacity = '0';
                        el.style.width = `${particle.size * 1.5}px`;
                        el.style.height = `${particle.size * 1.5}px`;
                        
                        // ブレンドモードに応じた色の変更（既存の処理）
                        if (colorSettings.blendMode === 'gradient' || colorSettings.blendMode === 'pulse') {
                          el.style.backgroundColor = colorSettings.subColor;
                        } else if (colorSettings.blendMode === 'random') {
                          const colors = [colorSettings.mainColor, colorSettings.subColor];
                          const randomColor = colors[Math.floor(Math.random() * colors.length)];
                          el.style.backgroundColor = randomColor;
                        }
                      }
                    }, 10);
                  }
                }}
              />
            ))}
          </MainContainer>
          
          <ControlPanel 
            isSoundOn={isSoundOn}
            setIsSoundOn={setIsSoundOn}
            isSettingsPanelOpen={isSettingsPanelOpen}
            setIsSettingsPanelOpen={setIsSettingsPanelOpen}
            isSettingSpawn={isSettingSpawn}
            setIsSettingSpawn={setIsSettingSpawn}
            isAutoFartEnabled={isAutoFartEnabled}
            toggleAutoFart={toggleAutoFart}
          />
          
          {/* スポーン地点操作中のインジケーター */}
          <SpawnIndicator 
            isVisible={isSettingSpawn}
            spawnPoints={spawnPoints}
          />
          
          {isSettingsPanelOpen && (
            <SettingsPanel 
              smokeSettings={smokeSettings}
              setSmokeSettings={setSmokeSettings}
              colorSettings={colorSettings}
              setColorSettings={setColorSettings}
              spawnPoints={spawnPoints}
              addSpawnPoint={addSpawnPoint}
              removeSpawnPoint={removeSpawnPoint}
              removeAllSpawnPoints={removeAllSpawnPoints}
              updateSpawnPointColor={updateSpawnPointColor}
              updateSpawnPointActive={updateSpawnPointActive}
              activateAllSpawnPoints={activateAllSpawnPoints}
              deactivateAllSpawnPoints={deactivateAllSpawnPoints}
              spawnMode={spawnMode}
              setSpawnMode={setSpawnMode}
              backgroundImage={backgroundImage}
              setBackgroundImage={setBackgroundImage}
              isSoundOn={isSoundOn}
              selectedSoundUrl={selectedSoundUrl}
              setSelectedSoundUrl={setSelectedSoundUrl}
              soundGenres={soundGenres}
              soundsByGenre={soundsByGenre}
              selectedSoundGenre={selectedSoundGenre}
              setSelectedSoundGenre={setSelectedSoundGenre}
              isRandomSoundInGenre={isRandomSoundInGenre}
              setIsRandomSoundInGenre={setIsRandomSoundInGenre}
              updateSoundBurstCount={updateSoundBurstCount}
              isAutoFartEnabled={isAutoFartEnabled}
              toggleAutoFart={toggleAutoFart}
              autoFartInterval={autoFartInterval}
              setAutoFartInterval={setAutoFartInterval}
              autoFartRandomPosition={autoFartRandomPosition}
              setAutoFartRandomPosition={setAutoFartRandomPosition}
              autoFartSoundOption={autoFartSoundOption}
              setAutoFartSoundOption={setAutoFartSoundOption}
              displaySettings={displaySettings}
              setDisplaySettings={setDisplaySettings}
              vibrationStrength={vibrationStrength}
              setVibrationStrength={setVibrationStrength}
              onClose={() => setIsSettingsPanelOpen(false)}
            />
          )}
        </>
      )}
    </AppContainer>
  );
}

export default App;