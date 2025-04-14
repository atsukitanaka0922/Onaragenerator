import React from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  background-color: ${props => props.isActive ? '#e74c3c' : '#2ecc71'};
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const SliderContainer = styled.div`
  margin-top: 15px;
  width: 100%;
`;

const SliderLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const SliderValue = styled.span`
  min-width: 30px;
  text-align: right;
`;

const Slider = styled.input`
  width: 100%;
`;

const OptionGroup = styled.div`
  margin-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-top: 10px;
`;

function AutoFartSettings({ 
  isAutoFartEnabled, 
  toggleAutoFart, 
  autoFartInterval, 
  setAutoFartInterval,
  autoFartRandomPosition,
  setAutoFartRandomPosition,
  autoFartSoundOption,
  setAutoFartSoundOption
}) {
  return (
    <SettingsGroup>
      <h4>自動おなら設定</h4>
      
      <ToggleContainer>
        <div>自動おならモード:</div>
        <ToggleButton 
          isActive={isAutoFartEnabled}
          onClick={toggleAutoFart}
        >
          {isAutoFartEnabled ? '停止' : '開始'}
        </ToggleButton>
      </ToggleContainer>
      
      <SliderContainer>
        <SliderLabel>
          間隔（秒）
          <SliderValue>{autoFartInterval}</SliderValue>
        </SliderLabel>
        <Slider 
          type="range" 
          min="1" 
          max="30" 
          value={autoFartInterval}
          onChange={(e) => setAutoFartInterval(parseInt(e.target.value))}
        />
      </SliderContainer>
      
      <OptionGroup>
        <h5>おなら音の設定</h5>
        <RadioContainer>
          <RadioOption>
            <input 
              type="radio" 
              checked={autoFartSoundOption === 'current'} 
              onChange={() => setAutoFartSoundOption('current')}
            />
            現在選択中の効果音を使用
          </RadioOption>
          <RadioOption>
            <input 
              type="radio" 
              checked={autoFartSoundOption === 'random'} 
              onChange={() => setAutoFartSoundOption('random')}
            />
            選択中のジャンルからランダム
          </RadioOption>
          <RadioOption>
            <input 
              type="radio" 
              checked={autoFartSoundOption === 'randomAll'} 
              onChange={() => setAutoFartSoundOption('randomAll')}
            />
            全ジャンルからランダム
          </RadioOption>
        </RadioContainer>
      </OptionGroup>
      
      <OptionGroup>
        <h5>おならの発生位置</h5>
        <CheckboxOption>
          <input 
            type="checkbox" 
            checked={autoFartRandomPosition} 
            onChange={(e) => setAutoFartRandomPosition(e.target.checked)}
          />
          ランダムな位置に発生（オフなら画面中央）
        </CheckboxOption>
      </OptionGroup>
      
      <div style={{ marginTop: '20px', fontSize: '0.9em', opacity: 0.7 }}>
        {isAutoFartEnabled ? 
          `自動おなら実行中: ${autoFartInterval}秒ごとに発生` : 
          '自動おなら停止中'}
      </div>
    </SettingsGroup>
  );
}

export default AutoFartSettings;
