import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  padding: 15px 10px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  /* モバイル対応 */
  @media (max-width: 768px) {
    right: 10px;
    padding: 12px 8px;
    gap: 12px;
  }
  
  /* 小さい画面での対応 */
  @media (max-height: 500px) {
    padding: 8px 6px;
    gap: 8px;
    
    /* ボタンサイズも小さく */
    button {
      width: 32px;
      height: 32px;
      font-size: 1.2rem;
    }
  }
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
  transition: all 0.2s ease;
  border-radius: 50%;
  
  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
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
  transition: all 0.2s ease;
  border-radius: 50%;
  
  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SpawnButton = styled.button`
  background-color: ${props => props.active ? '#f44336' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => props.active ? '0 0 8px #f44336' : 'none'};
  
  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.active ? '#e53935' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const AutoFartButton = styled.button`
  background-color: ${props => props.isActive ? '#e74c3c' : '#2ecc71'};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => props.isActive ? '0 0 8px #e74c3c' : '0 0 8px #2ecc71'};
  
  &:hover {
    transform: scale(1.1);
    background-color: ${props => props.isActive ? '#c0392b' : '#27ae60'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Divider = styled.div`
  width: 25px;
  height: 2px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
  margin: 2px 0;
  border-radius: 1px;
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
      <SoundButton onClick={toggleSound} title="効果音のオン/オフ">
        {isSoundOn ? '🔊' : '🔇'}
      </SoundButton>
      
      <Divider />
      
      <SettingsButton onClick={toggleSettingsPanel} title="設定パネル">
        ⚙️
      </SettingsButton>
      
      <SpawnButton 
        active={isSettingSpawn}
        onClick={toggleSettingSpawn}
        title="スポーン地点の設定"
      >
        📍
      </SpawnButton>
      
      <AutoFartButton 
        isActive={isAutoFartEnabled}
        onClick={toggleAutoFart}
        title={isAutoFartEnabled ? "自動おなら停止" : "自動おなら開始"}
      >
        {isAutoFartEnabled ? '⏹️' : '▶️'}
      </AutoFartButton>
    </Panel>
  );
}

export default ControlPanel;