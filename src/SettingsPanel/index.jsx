import React, { useState } from 'react';
import styled from 'styled-components';
import SmokeParameterSettings from './SmokeParameterSettings';
import ColorSettings from './ColorSettings';
import EffectTypeSettings from './EffectTypeSettings';
import SpawnPointSettings from './SpawnPointSettings';
import BackgroundSettings from './BackgroundSettings';
import SimpleSoundSettings from './SimpleSoundSettings';
import ReadmeContent from './ReadmeContent';

const Panel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  color: white;
  z-index: 50;
  max-width: 320px;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button`
  padding: 8px 12px;
  background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.7)' : 'transparent'};
  color: white;
  border: none;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  margin-right: 5px;
  margin-bottom: 5px;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const TabContent = styled.div`
  margin-top: 10px;
`;

function SettingsPanel({
  smokeSettings,
  setSmokeSettings,
  colorSettings,
  setColorSettings,
  spawnPoints,
  addSpawnPoint,
  removeSpawnPoint,
  removeAllSpawnPoints,
  backgroundImage,
  setBackgroundImage,
  isSoundOn,
  selectedSoundUrl,
  setSelectedSoundUrl,
  soundGenres,
  soundsByGenre,
  selectedSoundGenre,
  setSelectedSoundGenre,
  isRandomSoundInGenre,
  setIsRandomSoundInGenre,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('smoke');
  
  return (
    <Panel>
      <CloseButton onClick={onClose}>✕</CloseButton>
      <h3>設定</h3>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'readme'} 
          onClick={() => setActiveTab('readme')}
        >
          README
        </Tab>
        <Tab 
          active={activeTab === 'background'} 
          onClick={() => setActiveTab('background')}
        >
          背景
        </Tab>
        <Tab 
          active={activeTab === 'smoke'} 
          onClick={() => setActiveTab('smoke')}
        >
          おなら
        </Tab>
        <Tab 
          active={activeTab === 'color'} 
          onClick={() => setActiveTab('color')}
        >
          色
        </Tab>
        <Tab 
          active={activeTab === 'effect'} 
          onClick={() => setActiveTab('effect')}
        >
          エフェクト
        </Tab>
        <Tab 
          active={activeTab === 'sound'} 
          onClick={() => setActiveTab('sound')}
        >
          効果音
        </Tab>
        <Tab 
          active={activeTab === 'spawn'} 
          onClick={() => setActiveTab('spawn')}
        >
          スポーン
        </Tab>
      </TabsContainer>
      
      <TabContent>
        {activeTab === 'readme' && (
          <ReadmeContent />
        )}
        
        {activeTab === 'background' && (
          <BackgroundSettings 
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
          />
        )}
        
        {activeTab === 'smoke' && (
          <SmokeParameterSettings 
            smokeSettings={smokeSettings}
            setSmokeSettings={setSmokeSettings}
          />
        )}
        
        {activeTab === 'color' && (
          <ColorSettings 
            colorSettings={colorSettings}
            setColorSettings={setColorSettings}
          />
        )}
        
        {activeTab === 'effect' && (
          <EffectTypeSettings 
            smokeSettings={smokeSettings}
            setSmokeSettings={setSmokeSettings}
          />
        )}
        
        {activeTab === 'sound' && (
          <SimpleSoundSettings 
            selectedSoundUrl={selectedSoundUrl}
            setSelectedSoundUrl={setSelectedSoundUrl}
            isSoundOn={isSoundOn}
            soundGenres={soundGenres}
            soundsByGenre={soundsByGenre}
            selectedSoundGenre={selectedSoundGenre}
            setSelectedSoundGenre={setSelectedSoundGenre}
            isRandomSoundInGenre={isRandomSoundInGenre}
            setIsRandomSoundInGenre={setIsRandomSoundInGenre}
          />
        )}
        
        {activeTab === 'spawn' && (
          <SpawnPointSettings 
            spawnPoints={spawnPoints}
            addSpawnPoint={addSpawnPoint}
            removeSpawnPoint={removeSpawnPoint}
            removeAllSpawnPoints={removeAllSpawnPoints}
          />
        )}
      </TabContent>
    </Panel>
  );
}

export default SettingsPanel;