import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';
import MainContainer from './components/MainContainer';
import ControlPanel from './components/ControlPanel';
import SettingsPanel from './components/SettingsPanel';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
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

function App() {
  // エラー状態
  const [hasError, setHasError] = useState(false);
  
  // アプリケーション状態
  const [isStarted, setIsStarted] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isSettingSpawn, setIsSettingSpawn] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isCreatingSmoke, setIsCreatingSmoke] = useState(false);
  
  // 効果音関連の状態
  const [selectedSoundUrl, setSelectedSoundUrl] = useState('/sounds/small1.mp3');
  const [selectedSoundGenre, setSelectedSoundGenre] = useState('pop');
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
    id: 'sneaky',
    name: 'Sneaky',
    description: 'こっそりとした不思議な効果音'
  }
];

  // ジャンルごとの効果音のリスト
  const soundsByGenre = {
  small: [
    { id: 'small1', url: '/sounds/small1.mp3', name: 'Small 1' },
    { id: 'small2', url: '/sounds/small2.mp3', name: 'Small 2' },
    { id: 'small3', url: '/sounds/small3.mp3', name: 'Small 3' }
  ],
  medium: [
    { id: 'medium1', url: '/sounds/medium1.mp3', name: 'Medium 1' },
    { id: 'medium2', url: '/sounds/medium2.mp3', name: 'Medium 2' },
    { id: 'medium3', url: '/sounds/medium3.mp3', name: 'Medium 3' }
  ],
  big: [
    { id: 'big1', url: '/sounds/big1.mp3', name: 'Big 1' },
    { id: 'big2', url: '/sounds/big2.mp3', name: 'Big 2' },
    { id: 'big3', url: '/sounds/big3.mp3', name: 'Big 3' }
  ],
  sneaky: [
    { id: 'sneaky1', url: '/sounds/sneaky1.mp3', name: 'Sneaky 1' },
    { id: 'sneaky2', url: '/sounds/sneaky2.mp3', name: 'Sneaky 2' },
    { id: 'sneaky3', url: '/sounds/sneaky3.mp3', name: 'Sneaky 3' }
  ]
};
  
  // ジャンルからランダムに効果音を選択する関数
  const getRandomSoundFromGenre = useCallback((genreId) => {
    const sounds = soundsByGenre[genreId] || [];
    if (sounds.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * sounds.length);
    return sounds[randomIndex].url;
  }, [soundsByGenre]);
  
  // スポーン地点
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [nextSpawnId, setNextSpawnId] = useState(1);
  
  // 煙のエフェクト設定
  const [smokeSettings, setSmokeSettings] = useState({
    size: 50,
    count: 8,
    speed: 1.0,
    duration: 3.0,
    effectType: 'normal',
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
  
  // デバッグ用: エフェクト設定の変更を監視
  useEffect(() => {
    console.log('エフェクト設定が変更されました:', smokeSettings.effectType);
  }, [smokeSettings.effectType]);
  
  const startApp = () => {
    setIsStarted(true);
    console.log("アプリを開始しました");
    
    // 初期スポーン地点を追加
    addSpawnPoint(window.innerWidth / 2, window.innerHeight - 100);
  };
  
  // スポーン地点を追加
  const addSpawnPoint = (x, y) => {
    const newSpawnPoint = {
      id: nextSpawnId,
      x,
      y
    };
    
    setSpawnPoints([...spawnPoints, newSpawnPoint]);
    setNextSpawnId(nextSpawnId + 1);
    
    console.log(`スポーン地点を追加しました: ID=${newSpawnPoint.id}, x=${x}, y=${y}`);
    return newSpawnPoint.id;
  };
  
  // スポーン地点の位置を更新
  const updateSpawnPointPosition = (id, x, y) => {
    setSpawnPoints(spawnPoints.map(point => 
      point.id === id ? { ...point, x, y } : point
    ));
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
  
  // 煙パーティクルの追加
  const addParticle = useCallback((spawnX, spawnY, targetX, targetY) => {
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
        opacity: 0.7
      };
      
      console.log(`パーティクル追加: ID=${newId}, 開始=(${spawnX},${spawnY}), 目標=(${targetX},${targetY})`);
      
      // パーティクルを追加
      setParticles(prev => [...prev, newParticle]);
      
      // 一定時間後に自動的に削除
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newId));
      }, smokeSettings.duration * 1000);
      
      return newId;
    } catch (error) {
      console.error('パーティクル追加エラー:', error);
      return null;
    }
  }, [smokeSettings.size, smokeSettings.duration]);
  
  // スポーン地点をタップするための処理を追加
  const handleSpawnPointDrag = useCallback((id, x, y) => {
    console.log(`スポーン地点の移動: ID=${id}, x=${x}, y=${y}`);
    updateSpawnPointPosition(id, x, y);
  }, [updateSpawnPointPosition]);
  
  // 煙のバースト生成 - エフェクトタイプに対応
  const createSmokeBurst = useCallback((x, y) => {
    // 既に実行中なら処理しない
    if (isCreatingSmoke) {
      console.log('煙生成処理中のため、リクエストをスキップします');
      return;
    }
    
    console.log(`煙バースト生成: 目標位置 x=${x}, y=${y}, エフェクトタイプ: ${smokeSettings.effectType}`);
    
    // 処理中フラグを立てる
    setIsCreatingSmoke(true);
    
    try {
      // スポーン地点がない場合は緊急追加
      if (spawnPoints.length === 0) {
        const id = addSpawnPoint(window.innerWidth / 2, window.innerHeight - 100);
        console.log(`緊急スポーン地点が追加されました: ID=${id}`);
        setIsCreatingSmoke(false);
        return;
      }
      
      // 効果音を再生
      if (isSoundOn) {
        try {
          // ジャンル内でランダム再生がオンの場合
          let soundUrl;
          if (isRandomSoundInGenre) {
            soundUrl = getRandomSoundFromGenre(selectedSoundGenre);
          } else {
            soundUrl = selectedSoundUrl;
          }
          
          const audio = new Audio(soundUrl || '/sounds/pop1.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.log('効果音再生エラー:', e));
        } catch (e) {
          console.log('効果音の処理中にエラー:', e);
        }
      }
      
      const particleCount = Math.min(smokeSettings.count, 15); // 上限15個
      
      // エフェクトタイプに基づいて処理
      switch (smokeSettings.effectType) {
        case 'explosion':
          // 爆発エフェクト
          spawnPoints.forEach(spawn => {
            console.log(`スポーン地点 ${spawn.id} から爆発エフェクトを生成`);
            for (let i = 0; i < particleCount; i++) {
              // 360度全方向にランダムな角度で発射
              const angle = Math.random() * Math.PI * 2;
              const distance = 100 + Math.random() * 200; // ランダムな距離
              
              const targetX = spawn.x + Math.cos(angle) * distance;
              const targetY = spawn.y + Math.sin(angle) * distance;
              
              setTimeout(() => {
                addParticle(spawn.x, spawn.y, targetX, targetY);
              }, i * 30);
            }
          });
          break;
          
        case 'spiral':
          // 螺旋エフェクト
          spawnPoints.forEach(spawn => {
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
                addParticle(spawn.x, spawn.y, targetX, targetY);
              }, i * 80);
            }
          });
          break;
          
        case 'fountain':
          // 噴水エフェクト
          spawnPoints.forEach(spawn => {
            console.log(`スポーン地点 ${spawn.id} から噴水エフェクトを生成`);
            for (let i = 0; i < particleCount; i++) {
              // 上方向を中心にしたランダムな角度（-45度〜+45度）
              const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI/2;
              const distance = 150 + Math.random() * 200; // ランダムな距離
              
              const targetX = spawn.x + Math.cos(angle) * distance;
              const targetY = spawn.y + Math.sin(angle) * distance;
              
              setTimeout(() => {
                addParticle(spawn.x, spawn.y, targetX, targetY);
              }, i * 60);
            }
          });
          break;
          
        case 'ring':
          // リングエフェクト
          spawnPoints.forEach(spawn => {
            console.log(`スポーン地点 ${spawn.id} からリングエフェクトを生成`);
            for (let i = 0; i < particleCount; i++) {
              // 円周上に均等に配置
              const angle = (i / particleCount) * Math.PI * 2;
              const distance = 100; // 固定距離
              
              const targetX = spawn.x + Math.cos(angle) * distance;
              const targetY = spawn.y + Math.sin(angle) * distance;
              
              // 全て同時に発射
              addParticle(spawn.x, spawn.y, targetX, targetY);
            }
          });
          break;
          
        case 'normal':
        default:
          // 通常エフェクト
          spawnPoints.forEach(spawn => {
            console.log(`スポーン地点 ${spawn.id} から通常エフェクトを生成: (${spawn.x}, ${spawn.y}) → 目標: (${x}, ${y})`);
            
            for (let i = 0; i < particleCount; i++) {
              // タップ位置周辺にバラけさせる
              const offsetX = x + (Math.random() * 60 - 30);
              const offsetY = y + (Math.random() * 60 - 30);
              
              // 少し遅延させて生成
              setTimeout(() => {
                // スポーン地点から発生し、タップした位置の周辺を目標とする
                addParticle(spawn.x, spawn.y, offsetX, offsetY);
              }, i * 20);
            }
          });
          break;
      }
    } catch (error) {
      console.error('煙生成エラー:', error);
      setHasError(true);
    } finally {
      // 処理中フラグを解除
      setTimeout(() => {
        setIsCreatingSmoke(false);
      }, 300);
    }
  }, [isCreatingSmoke, spawnPoints, isSoundOn, selectedSoundUrl, selectedSoundGenre, isRandomSoundInGenre, getRandomSoundFromGenre, smokeSettings, addParticle, addSpawnPoint]);

  // メイン画面のクリックイベント処理関数
  const handleInteraction = useCallback((x, y) => {
    createSmokeBurst(x, y);
  }, [createSmokeBurst]);
  
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
            {/* スポーン地点 - ドラッグ機能を追加 */}
            {spawnPoints.map(point => (
              <div 
                key={point.id}
                style={{
                  position: 'absolute',
                  width: '30px',
                  height: '30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '2px dashed #FF5722',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: isSettingSpawn ? 'flex' : 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
                  left: `${point.x}px`,
                  top: `${point.y}px`,
                  zIndex: 10,
                  cursor: isSettingSpawn ? 'move' : 'default'
                }}
                onMouseDown={isSettingSpawn ? (e) => {
                  // ドラッグ開始
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startPointX = point.x;
                  const startPointY = point.y;
                  
                  const handleMouseMove = (moveEvent) => {
                    const dx = moveEvent.clientX - startX;
                    const dy = moveEvent.clientY - startY;
                    handleSpawnPointDrag(point.id, startPointX + dx, startPointY + dy);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                  
                  e.preventDefault();
                  e.stopPropagation();
                } : undefined}
              >
                {point.id}
              </div>
            ))}
            
            {/* 煙パーティクル */}
            {particles.map(particle => (
              <div
                key={particle.id}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: colorSettings.mainColor,
                  borderRadius: '50%',
                  opacity: particle.opacity,
                  filter: 'blur(5px)',
                  // 初期位置をスポーン地点に設定
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  transform: 'translate(-50%, -50%)',
                  transition: `all ${smokeSettings.duration}s ease-out`
                }}
                // 要素が表示されたら目標位置に移動するアニメーションを開始
                ref={el => {
                  if (el) {
                    // 少し遅延させてアニメーションを開始
                    setTimeout(() => {
                      // 目標位置に向かって移動
                      el.style.left = `${particle.targetX}px`;
                      el.style.top = `${particle.targetY}px`;
                      // フェードアウトと拡大
                      el.style.opacity = '0';
                      el.style.width = `${particle.size * 1.5}px`;
                      el.style.height = `${particle.size * 1.5}px`;
                      el.style.filter = 'blur(8px)';
                      
                      // ブレンドモードに応じて色を変更
                      if (colorSettings.blendMode === 'gradient' || colorSettings.blendMode === 'pulse') {
                        el.style.backgroundColor = colorSettings.subColor;
                      } else if (colorSettings.blendMode === 'random') {
                        // ランダムモードではメインとサブからランダムに選ぶ
                        const colors = [colorSettings.mainColor, colorSettings.subColor];
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        el.style.backgroundColor = randomColor;
                      }
                      // ストライプモードの場合は個別のパーティクルに適用が難しいため省略
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
              onClose={() => setIsSettingsPanelOpen(false)}
            />
          )}
        </>
      )}
    </AppContainer>
  );
}

export default App;