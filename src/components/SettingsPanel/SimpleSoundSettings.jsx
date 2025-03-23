import React from 'react';
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
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin-top: 10px;
`;

const SoundButton = styled.button`
  padding: 8px;
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.active || props.disabled ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const PlayIcon = styled.span`
  font-size: 1rem;
  margin-right: 5px;
`;

function SimpleSoundSettings({ 
  selectedSoundUrl, 
  setSelectedSoundUrl,
  isSoundOn,
  soundGenres,
  soundsByGenre,
  selectedSoundGenre,
  setSelectedSoundGenre,
  isRandomSoundInGenre,
  setIsRandomSoundInGenre
}) {  
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
  
  // ランダム再生切り替えハンドラ
  const handleRandomToggle = () => {
    setIsRandomSoundInGenre(!isRandomSoundInGenre);
  };
  
  return (
    <SettingsGroup>
      <h4>効果音設定</h4>
      
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
          <SoundButton 
            key={sound.id}
            active={sound.url === selectedSoundUrl}
            onClick={() => !isRandomSoundInGenre && handleSoundClick(sound.url)}
            disabled={isRandomSoundInGenre}
          >
            <PlayIcon>▶</PlayIcon>
            <span>{sound.name}</span>
          </SoundButton>
        ))}
      </SoundGrid>
      
      <div style={{ marginTop: '15px' }}>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {isSoundOn 
            ? isRandomSoundInGenre 
              ? `効果音オン: ${soundGenres.find(g => g.id === selectedSoundGenre)?.name}をランダム再生`
              : '効果音オン: 選択した効果音を再生' 
            : '効果音オフ: 右上の🔇ボタンでオン/オフできます'
          }
        </p>
      </div>
    </SettingsGroup>
  );
}

export default SimpleSoundSettings;