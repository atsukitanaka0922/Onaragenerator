import React from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const EffectButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const EffectButton = styled.button`
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

const CheckboxOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

function EffectTypeSettings({ smokeSettings, setSmokeSettings }) {
  // エフェクトタイプ変更ハンドラ
  const handleEffectTypeChange = (type) => {
    console.log(`エフェクトタイプを変更: ${type}`);
    setSmokeSettings({
      ...smokeSettings,
      effectType: type
    });
  };
  
  // エフェクトオプション変更ハンドラ
  const handleOptionChange = (option, checked) => {
    console.log(`エフェクトオプションを変更: ${option} = ${checked}`);
    setSmokeSettings({
      ...smokeSettings,
      options: {
        ...smokeSettings.options,
        [option]: checked
      }
    });
  };
  
  return (
    <SettingsGroup>
      <h4>エフェクトタイプ</h4>
      
      <EffectButtons>
        <EffectButton 
          active={smokeSettings.effectType === 'normal'}
          onClick={() => handleEffectTypeChange('normal')}
        >
          標準
        </EffectButton>
        <EffectButton 
          active={smokeSettings.effectType === 'explosion'}
          onClick={() => handleEffectTypeChange('explosion')}
        >
          爆発
        </EffectButton>
        <EffectButton 
          active={smokeSettings.effectType === 'spiral'}
          onClick={() => handleEffectTypeChange('spiral')}
        >
          螺旋
        </EffectButton>
        <EffectButton 
          active={smokeSettings.effectType === 'fountain'}
          onClick={() => handleEffectTypeChange('fountain')}
        >
          噴水
        </EffectButton>
        <EffectButton 
          active={smokeSettings.effectType === 'ring'}
          onClick={() => handleEffectTypeChange('ring')}
        >
          リング
        </EffectButton>
      </EffectButtons>
      
      <div style={{ marginTop: '15px' }}>
        <h4>エフェクトオプション</h4>
        <CheckboxOptions>
          <CheckboxLabel>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.fade} 
              onChange={(e) => handleOptionChange('fade', e.target.checked)} 
            />
            フェード
          </CheckboxLabel>
          <CheckboxLabel>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.gravity} 
              onChange={(e) => handleOptionChange('gravity', e.target.checked)} 
            />
            重力
          </CheckboxLabel>
          <CheckboxLabel>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.pulsate} 
              onChange={(e) => handleOptionChange('pulsate', e.target.checked)} 
            />
            脈動
          </CheckboxLabel>
          <CheckboxLabel>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.trail} 
              onChange={(e) => handleOptionChange('trail', e.target.checked)} 
            />
            軌跡
          </CheckboxLabel>
        </CheckboxOptions>
      </div>
    </SettingsGroup>
  );
}

export default EffectTypeSettings;