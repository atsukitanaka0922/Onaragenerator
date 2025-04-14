import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const GenreTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
`;

const GenreTab = styled.button`
  padding: 6px 10px;
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const GenreDescription = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 10px;
  font-style: italic;
`;

const SoundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 5px;
  margin-top: 10px;
`;

const SoundItem = styled.div`
  padding: 10px;
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  &:hover {
    background-color: ${props => props.active || props.disabled ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const SoundNameRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayIcon = styled.span`
  font-size: 1rem;
  margin-right: 5px;
  cursor: pointer;
`;

const BurstCountControl = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const CountButton = styled.button`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const CountDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: bold;
`;

// 新しい音設定コンポーネント - 発射回数の編集機能を追加
function AdvancedSoundSettings({ 
  selectedSoundUrl, 
  setSelectedSoundUrl,
  isSoundOn,
  soundGenres,
  soundsByGenre,
  selectedSoundGenre,
  setSelectedSoundGenre,
  isRandomSoundInGenre,
  setIsRandomSoundInGenre,
  updateSoundBurstCount // 新しいプロパティ - 発射回数を更新する関数
}) {  
  // 編集モード状態
  const [isEditMode, setIsEditMode] = useState(false);
  
  // ジャンル変更ハンドラ
  const handleGenreChange = (genreId) => {
    setSelectedSoundGenre(genreId);
  };
  
  // 現在選択中のジャンルの説明を取得
  const getGenreDescription = () => {
    const genre = soundGenres.find(g => g.id === selectedSoundGenre);
    return genre ? genre.description : '';
  };
  
  // 現在のジャンルの効果音リスト
  const currentSounds = soundsByGenre[selectedSoundGenre] || [];
  
  // サウンドボタンクリックハンドラ
  const handleSoundClick = (soundUrl) => {
    setSelectedSoundUrl(soundUrl);
    
    // プレビュー再生
    if (isSoundOn) {
      try {
        const audio = new Audio(soundUrl);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('効果音プレビュー再生エラー:', e));
      } catch (e) {
        console.log('効果音プレビューエラー:', e);
      }
    }
  };
  
  // 発射回数を増減するハンドラ
  const handleBurstCountChange = (soundId, increment) => {
    // 現在の効果音を検索
    const sound = currentSounds.find(s => s.id === soundId);
    if (!sound) return;
    
    // 新しい発射回数を計算（1〜5の範囲に制限）
    const newCount = Math.max(1, Math.min(5, sound.burstCount + increment));
    
    // 親コンポーネントの更新関数を呼び出す
    updateSoundBurstCount(selectedSoundGenre, soundId, newCount);
  };
  
  // ランダム再生切り替えハンドラ
  const handleRandomToggle = () => {
    setIsRandomSoundInGenre(!isRandomSoundInGenre);
  };
  
  // 編集モード切り替えハンドラ
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  
  return (
    <SettingsGroup>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4>効果音設定</h4>
        <button 
          onClick={toggleEditMode}
          style={{
            padding: '5px 10px',
            backgroundColor: isEditMode ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {isEditMode ? '編集終了' : '発射回数編集'}
        </button>
      </div>
      
      {/* ジャンル選択タブ */}
      <GenreTabs>
        {soundGenres.map(genre => (
          <GenreTab 
            key={genre.id}
            active={selectedSoundGenre === genre.id}
            onClick={() => handleGenreChange(genre.id)}
          >
            {genre.name}
          </GenreTab>
        ))}
      </GenreTabs>
      
      {/* 選択中のジャンルの説明 */}
      <GenreDescription>
        {getGenreDescription()}
      </GenreDescription>
      
      {/* ランダム再生オプション */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={isRandomSoundInGenre}
            onChange={handleRandomToggle}
            style={{ marginRight: '8px' }}
          />
          このジャンルからランダムに効果音を再生
        </label>
      </div>
      
      {/* 効果音リスト - ランダム再生がオフの時のみ選択可能 */}
      <SoundGrid style={{ opacity: isRandomSoundInGenre ? 0.5 : 1 }}>
        {currentSounds.map(sound => (
          <SoundItem 
            key={sound.id}
            active={sound.url === selectedSoundUrl}
            onClick={() => !isRandomSoundInGenre && !isEditMode && handleSoundClick(sound.url)}
            disabled={isRandomSoundInGenre}
          >
            <SoundNameRow>
              <div>
                <PlayIcon onClick={(e) => {
                  e.stopPropagation();
                  if (isSoundOn) {
                    const audio = new Audio(sound.url);
                    audio.volume = 0.3;
                    audio.play().catch(e => console.log('効果音プレビュー再生エラー:', e));
                  }
                }}>▶</PlayIcon>
                <span>{sound.name}</span>
              </div>
              <span>発射: {sound.burstCount}回</span>
            </SoundNameRow>
            
            {/* 編集モード時のみ表示する発射回数コントロール */}
            {isEditMode && (
              <BurstCountControl onClick={(e) => e.stopPropagation()}>
                <CountButton 
                  onClick={() => handleBurstCountChange(sound.id, -1)}
                  disabled={sound.burstCount <= 1}
                >-</CountButton>
                <CountDisplay>{sound.burstCount}</CountDisplay>
                <CountButton 
                  onClick={() => handleBurstCountChange(sound.id, 1)}
                  disabled={sound.burstCount >= 5}
                >+</CountButton>
              </BurstCountControl>
            )}
          </SoundItem>
        ))}
      </SoundGrid>
      
      <div style={{ marginTop: '15px' }}>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {isSoundOn 
            ? isRandomSoundInGenre 
              ? `効果音オン: ${soundGenres.find(g => g.id === selectedSoundGenre)?.name}をランダム再生`
              : `効果音オン: ${currentSounds.find(s => s.url === selectedSoundUrl)?.name || '選択なし'} (${currentSounds.find(s => s.url === selectedSoundUrl)?.burstCount || 0}回発射)` 
            : '効果音オフ: 右上の🔇ボタンでオン/オフできます'
          }
        </p>
      </div>
    </SettingsGroup>
  );
}

export default AdvancedSoundSettings;