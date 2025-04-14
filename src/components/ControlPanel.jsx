import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  z-index: 10;
`;

const SoundButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SpawnButton = styled.button`
  background-color: ${props => props.active ? '#f44336' : 'rgba(255, 255, 255, 0.2)'};
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

const Divider = styled.div`
  width: 1px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 10px;
`;

function ControlPanel({ 
  isSoundOn, 
  setIsSoundOn, 
  isSettingsPanelOpen, 
  setIsSettingsPanelOpen,
  isSettingSpawn,
  setIsSettingSpawn,
  isAutoFartEnabled,
  toggleAutoFart
}) {
  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };
  
  const toggleSettingsPanel = () => {
    setIsSettingsPanelOpen(!isSettingsPanelOpen);
  };
  
  const toggleSettingSpawn = () => {
    setIsSettingSpawn(!isSettingSpawn);
  };
  
  return (
    <Panel>
      <SoundButton onClick={toggleSound}>
        {isSoundOn ? '🔊' : '🔇'}
      </SoundButton>
      
      <Divider />
      
      <SettingsButton onClick={toggleSettingsPanel}>
        ⚙️
      </SettingsButton>
      
      <SpawnButton 
        active={isSettingSpawn}
        onClick={toggleSettingSpawn}
      >
        📍
      </SpawnButton>
      
      <AutoFartButton 
        isActive={isAutoFartEnabled}
        onClick={toggleAutoFart}
      >
        {isAutoFartEnabled ? '⏹️' : '▶️'}
      </AutoFartButton>
    </Panel>
  );
}

export default ControlPanel;