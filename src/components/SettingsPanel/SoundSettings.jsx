import { useRef } from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
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
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const PlayIcon = styled.span`
  font-size: 1rem;
  margin-right: 5px;
`;

const RemoveButton = styled.span`
  color: #ff5252;
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    color: #ff1744;
  }
`;

const SoundDropZone = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SoundFileInput = styled.input`
  display: none;
`;

const SoundOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

function SoundSettings({ 
  sounds, 
  currentSoundIndex, 
  isSoundOn,
  setCurrentSound,
  playSound,
  addSound,
  removeSound
}) {
  const fileInputRef = useRef(null);
  
  // ファイル選択を開く
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // ファイル選択ハンドラ
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.includes('audio')) {
          await addSound(file);
        }
      }
    }
  };
  
  // サウンドボタンクリックハンドラ
  const handleSoundClick = (soundId) => {
    setCurrentSound(soundId);
    if (isSoundOn) {
      playSound(soundId);
    }
  };
  
  return (
    <SettingsGroup>
      <h4>効果音設定</h4>
      
      <SoundGrid>
        {sounds.map(sound => (
          <SoundButton 
            key={sound.id}
            active={sound.id === currentSoundIndex}
            onClick={() => handleSoundClick(sound.id)}
          >
            <PlayIcon>▶</PlayIcon>
            <span>{sound.name}</span>
            {!sound.url && (
              <RemoveButton onClick={(e) => {
                e.stopPropagation();
                removeSound(sound.id);
              }}>
                ×
              </RemoveButton>
            )}
          </SoundButton>
        ))}
      </SoundGrid>
      
      <SoundDropZone 
        onClick={openFileDialog}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
          e.currentTarget.style.borderColor = '#4CAF50';
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.style.backgroundColor = '';
          e.currentTarget.style.borderColor = '';
        }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.style.backgroundColor = '';
          e.currentTarget.style.borderColor = '';
          
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              if (file.type.includes('audio')) {
                await addSound(file);
              }
            }
          }
        }}
      >
        <p>効果音ファイルをここにドロップ</p>
        <p>または</p>
        <p>クリックして選択</p>
        <SoundFileInput 
          ref={fileInputRef}
          type="file" 
          accept="audio/*" 
          multiple 
          onChange={handleFileChange} 
        />
      </SoundDropZone>
    </SettingsGroup>
  );
}

export default SoundSettings;