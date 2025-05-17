import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isVibrationSupported } from '../../utils/vibrationUtils';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 15px 0;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToggleName = styled.div`
  font-weight: 500;
  margin-bottom: 2px;
`;

const ToggleDescription = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #4CAF50;
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px #4CAF50;
  }
  
  input:checked + .slider:before {
    transform: translateX(24px);
  }
  
  input:disabled + .slider {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VibrationStrengthContainer = styled.div`
  margin-top: 15px;
`;

const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
`;

const RadioButton = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background-color: ${props => props.selected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.selected ? '#4CAF50' : 'transparent'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .radio-label {
    margin-top: 5px;
    font-size: 0.85rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.3);
  font-size: 0.9rem;
`;

function DisplaySettings({ 
  displaySettings, 
  setDisplaySettings,
  vibrationStrength,
  setVibrationStrength
}) {
  const [vibrationSupported, setVibrationSupported] = useState(false);
  
  useEffect(() => {
    // マウント時に振動APIのサポート状況を確認
    setVibrationSupported(isVibrationSupported());
  }, []);
  
  // 表示設定の変更ハンドラ
  const handleDisplaySettingChange = (setting, value) => {
    setDisplaySettings({
      ...displaySettings,
      [setting]: value
    });
  };
  
  // 振動強度の変更ハンドラ
  const handleVibrationStrengthChange = (e) => {
    setVibrationStrength(e.target.value);
  };
  
  return (
    <SettingsGroup>
      <h4>表示設定</h4>
      
      <ToggleGroup>
        <ToggleRow>
          <ToggleLabel>
            <ToggleName>煙を表示</ToggleName>
            <ToggleDescription>おならの煙をビジュアル表示する</ToggleDescription>
          </ToggleLabel>
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={displaySettings.showSmoke} 
              onChange={(e) => handleDisplaySettingChange('showSmoke', e.target.checked)}
            />
            <span className="slider"></span>
          </ToggleSwitch>
        </ToggleRow>
        
        <ToggleRow>
          <ToggleLabel>
            <ToggleName>音を鳴らす</ToggleName>
            <ToggleDescription>おならの効果音を再生する</ToggleDescription>
          </ToggleLabel>
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={displaySettings.playSound} 
              onChange={(e) => handleDisplaySettingChange('playSound', e.target.checked)}
            />
            <span className="slider"></span>
          </ToggleSwitch>
        </ToggleRow>
        
        <ToggleRow>
          <ToggleLabel>
            <ToggleName>振動</ToggleName>
            <ToggleDescription>
              おなら時にデバイスを振動させる
              {!vibrationSupported && ' (※このデバイスでは未対応)'}
            </ToggleDescription>
          </ToggleLabel>
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={displaySettings.vibration} 
              onChange={(e) => handleDisplaySettingChange('vibration', e.target.checked)}
              disabled={!vibrationSupported}
            />
            <span className="slider"></span>
          </ToggleSwitch>
        </ToggleRow>
      </ToggleGroup>
      
      {displaySettings.vibration && vibrationSupported && (
        <VibrationStrengthContainer>
          <h5>振動の強さ</h5>
          <RadioGroup>
            <RadioButton selected={vibrationStrength === 'short'}>
              <input 
                type="radio" 
                name="vibrationStrength" 
                value="short" 
                checked={vibrationStrength === 'short'}
                onChange={handleVibrationStrengthChange}
              />
              <span>💨</span>
              <span className="radio-label">弱め</span>
            </RadioButton>
            
            <RadioButton selected={vibrationStrength === 'medium'}>
              <input 
                type="radio" 
                name="vibrationStrength" 
                value="medium" 
                checked={vibrationStrength === 'medium'}
                onChange={handleVibrationStrengthChange}
              />
              <span>💨💨</span>
              <span className="radio-label">普通</span>
            </RadioButton>
            
            <RadioButton selected={vibrationStrength === 'long'}>
              <input 
                type="radio" 
                name="vibrationStrength" 
                value="long" 
                checked={vibrationStrength === 'long'}
                onChange={handleVibrationStrengthChange}
              />
              <span>💨💨💨</span>
              <span className="radio-label">強め</span>
            </RadioButton>
            
            <RadioButton selected={vibrationStrength === 'explosive'}>
              <input 
                type="radio" 
                name="vibrationStrength" 
                value="explosive" 
                checked={vibrationStrength === 'explosive'}
                onChange={handleVibrationStrengthChange}
              />
              <span>💥</span>
              <span className="radio-label">爆発的</span>
            </RadioButton>
            
            <RadioButton selected={vibrationStrength === 'subtle'}>
              <input 
                type="radio" 
                name="vibrationStrength" 
                value="subtle" 
                checked={vibrationStrength === 'subtle'}
                onChange={handleVibrationStrengthChange}
              />
              <span>🌫️</span>
              <span className="radio-label">控えめ</span>
            </RadioButton>
            
            <RadioButton selected={vibrationStrength === 'random'}>
              <input 
                type="radio" 
                name="vibrationStrength" 
                value="random" 
                checked={vibrationStrength === 'random'}
                onChange={handleVibrationStrengthChange}
              />
              <span>🎲</span>
              <span className="radio-label">ランダム</span>
            </RadioButton>
          </RadioGroup>
        </VibrationStrengthContainer>
      )}
      
      {/* デバイスが振動をサポートしない場合の情報 */}
      {!vibrationSupported && displaySettings.vibration && (
        <InfoBox>
          お使いのデバイスは振動APIをサポートしていません。デスクトップブラウザでは一般的に振動機能は利用できません。モバイルデバイスでは利用できる場合があります。
        </InfoBox>
      )}
      
      {/* 現在の設定の組み合わせを表示 */}
      <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
        現在の設定: 
        {displaySettings.showSmoke && displaySettings.playSound && displaySettings.vibration && '煙 + 音 + 振動'}
        {displaySettings.showSmoke && displaySettings.playSound && !displaySettings.vibration && '煙 + 音'}
        {displaySettings.showSmoke && !displaySettings.playSound && displaySettings.vibration && '煙 + 振動'}
        {!displaySettings.showSmoke && displaySettings.playSound && displaySettings.vibration && '音 + 振動'}
        {displaySettings.showSmoke && !displaySettings.playSound && !displaySettings.vibration && '煙のみ'}
        {!displaySettings.showSmoke && displaySettings.playSound && !displaySettings.vibration && '音のみ'}
        {!displaySettings.showSmoke && !displaySettings.playSound && displaySettings.vibration && '振動のみ'}
        {!displaySettings.showSmoke && !displaySettings.playSound && !displaySettings.vibration && 'すべてオフ'}
      </div>
    </SettingsGroup>
  );
}

export default DisplaySettings;