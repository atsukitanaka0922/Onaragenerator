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

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 20px 0;
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

  // 画面振動強度の変更ハンドラ
  const handleScreenShakeStrengthChange = (e) => {
    setDisplaySettings({
      ...displaySettings,
      screenShakeStrength: e.target.value
    });
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
            <ToggleName>デバイス振動</ToggleName>
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

        {/* 新しく追加する画面振動の設定 */}
        <ToggleRow>
          <ToggleLabel>
            <ToggleName>画面振動</ToggleName>
            <ToggleDescription>
              おなら時に画面を揺らす効果を有効にする
            </ToggleDescription>
          </ToggleLabel>
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={displaySettings.screenShake} 
              onChange={(e) => handleDisplaySettingChange('screenShake', e.target.checked)}
            />
            <span className="slider"></span>
          </ToggleSwitch>
        </ToggleRow>
      </ToggleGroup>
      
      {displaySettings.vibration && vibrationSupported && (
        <VibrationStrengthContainer>
          <h5>デバイス振動の強さ</h5>
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

      {/* 画面振動の強さ設定（新規追加） */}
      {displaySettings.screenShake && (
        <VibrationStrengthContainer>
          <h5>画面振動の強さ</h5>
          <RadioGroup>
            <RadioButton selected={displaySettings.screenShakeStrength === 'subtle'}>
              <input 
                type="radio" 
                name="screenShakeStrength" 
                value="subtle" 
                checked={displaySettings.screenShakeStrength === 'subtle'}
                onChange={handleScreenShakeStrengthChange}
              />
              <span>📱</span>
              <span className="radio-label">控えめ</span>
            </RadioButton>
            
            <RadioButton selected={displaySettings.screenShakeStrength === 'short'}>
              <input 
                type="radio" 
                name="screenShakeStrength" 
                value="short" 
                checked={displaySettings.screenShakeStrength === 'short'}
                onChange={handleScreenShakeStrengthChange}
              />
              <span>📱💨</span>
              <span className="radio-label">弱め</span>
            </RadioButton>
            
            <RadioButton selected={displaySettings.screenShakeStrength === 'medium'}>
              <input 
                type="radio" 
                name="screenShakeStrength" 
                value="medium" 
                checked={displaySettings.screenShakeStrength === 'medium' || !displaySettings.screenShakeStrength}
                onChange={handleScreenShakeStrengthChange}
              />
              <span>📱💨💨</span>
              <span className="radio-label">普通</span>
            </RadioButton>
            
            <RadioButton selected={displaySettings.screenShakeStrength === 'long'}>
              <input 
                type="radio" 
                name="screenShakeStrength" 
                value="long" 
                checked={displaySettings.screenShakeStrength === 'long'}
                onChange={handleScreenShakeStrengthChange}
              />
              <span>📱💨💨💨</span>
              <span className="radio-label">強め</span>
            </RadioButton>
            
            <RadioButton selected={displaySettings.screenShakeStrength === 'explosive'}>
              <input 
                type="radio" 
                name="screenShakeStrength" 
                value="explosive" 
                checked={displaySettings.screenShakeStrength === 'explosive'}
                onChange={handleScreenShakeStrengthChange}
              />
              <span>📱💥</span>
              <span className="radio-label">爆発的</span>
            </RadioButton>
            
            <RadioButton selected={displaySettings.screenShakeStrength === 'random'}>
              <input 
                type="radio" 
                name="screenShakeStrength" 
                value="random" 
                checked={displaySettings.screenShakeStrength === 'random'}
                onChange={handleScreenShakeStrengthChange}
              />
              <span>🎲</span>
              <span className="radio-label">ランダム</span>
            </RadioButton>
          </RadioGroup>
          <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
            ※画面振動はCPUによる処理が必要です。モバイルデバイスでのパフォーマンスに影響する場合があります。
          </div>
        </VibrationStrengthContainer>
      )}
      
      {/* デバイスが振動をサポートしない場合の情報 */}
      {!vibrationSupported && displaySettings.vibration && (
        <InfoBox>
          お使いのデバイスは振動APIをサポートしていません。デスクトップブラウザでは一般的に振動機能は利用できません。モバイルデバイスでは利用できる場合があります。
        </InfoBox>
      )}
      
      <Divider />
      
      {/* 現在の設定の組み合わせを表示 */}
      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        <div style={{ marginBottom: '5px' }}>有効な効果:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {displaySettings.showSmoke && (
            <span style={{ 
              padding: '3px 8px', 
              backgroundColor: 'rgba(76, 175, 80, 0.2)', 
              borderRadius: '12px' 
            }}>
              煙効果
            </span>
          )}
          {displaySettings.playSound && (
            <span style={{ 
              padding: '3px 8px', 
              backgroundColor: 'rgba(33, 150, 243, 0.2)', 
              borderRadius: '12px' 
            }}>
              効果音
            </span>
          )}
          {displaySettings.vibration && vibrationSupported && (
            <span style={{ 
              padding: '3px 8px', 
              backgroundColor: 'rgba(156, 39, 176, 0.2)', 
              borderRadius: '12px' 
            }}>
              デバイス振動
            </span>
          )}
          {displaySettings.screenShake && (
            <span style={{ 
              padding: '3px 8px', 
              backgroundColor: 'rgba(255, 152, 0, 0.2)', 
              borderRadius: '12px' 
            }}>
              画面振動
            </span>
          )}
          {!displaySettings.showSmoke && !displaySettings.playSound && 
           (!displaySettings.vibration || !vibrationSupported) && !displaySettings.screenShake && (
            <span style={{ 
              padding: '3px 8px', 
              backgroundColor: 'rgba(244, 67, 54, 0.2)', 
              borderRadius: '12px' 
            }}>
              すべてオフ
            </span>
          )}
        </div>
      </div>
    </SettingsGroup>
  );
}

export default DisplaySettings;