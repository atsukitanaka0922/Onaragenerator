import React from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const ModeOption = styled.div`
  padding: 12px;
  margin: 8px 0;
  background-color: ${props => props.selected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ModeIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 12px;
  min-width: 24px;
  text-align: center;
`;

const ModeContent = styled.div`
  flex: 1;
`;

const ModeTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ModeDescription = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
`;

const OptionSwitch = styled.label`
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
`;

const SwitchLabel = styled.span`
  flex: 1;
`;

const SwitchTrack = styled.div`
  position: relative;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background-color: ${props => props.checked ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s;
`;

const SwitchHandle = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.checked ? '22px' : '2px'};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transition: all 0.3s;
`;

function EffectModeSettings({ outputMode, setOutputMode, isVibrationEnabled, setIsVibrationEnabled }) {
  const handleModeChange = (mode) => {
    setOutputMode(mode);
  };
  
  const toggleVibration = () => {
    setIsVibrationEnabled(!isVibrationEnabled);
  };
  
  return (
    <SettingsGroup>
      <h4>出力モード設定</h4>
      
      <OptionSwitch onClick={toggleVibration}>
        <SwitchLabel>振動のオン/オフ</SwitchLabel>
        <SwitchTrack checked={isVibrationEnabled}>
          <SwitchHandle checked={isVibrationEnabled} />
        </SwitchTrack>
      </OptionSwitch>
      
      <div style={{ marginTop: '15px' }}>
        <ModeOption 
          selected={outputMode === 'full'} 
          onClick={() => handleModeChange('full')}
        >
          <ModeIcon>🎭</ModeIcon>
          <ModeContent>
            <ModeTitle>通常モード</ModeTitle>
            <ModeDescription>音・煙・振動をすべて出力します（デフォルト）</ModeDescription>
          </ModeContent>
        </ModeOption>
        
        <ModeOption 
          selected={outputMode === 'sound-only'} 
          onClick={() => handleModeChange('sound-only')}
        >
          <ModeIcon>🔊</ModeIcon>
          <ModeContent>
            <ModeTitle>音のみモード</ModeTitle>
            <ModeDescription>効果音と振動のみを出力します（煙は出ません）</ModeDescription>
          </ModeContent>
        </ModeOption>
        
        <ModeOption 
          selected={outputMode === 'vibration-only'} 
          onClick={() => handleModeChange('vibration-only')}
        >
          <ModeIcon>📳</ModeIcon>
          <ModeContent>
            <ModeTitle>振動のみモード</ModeTitle>
            <ModeDescription>振動のみを出力します（音も煙も出ません）</ModeDescription>
          </ModeContent>
        </ModeOption>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '0.85rem', opacity: '0.7' }}>
        ※振動機能はスマートフォンやタブレットなど、対応デバイスでのみ有効です
      </div>
    </SettingsGroup>
  );
}

export default EffectModeSettings;