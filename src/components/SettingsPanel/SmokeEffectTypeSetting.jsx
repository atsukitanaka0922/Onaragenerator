import React from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const EffectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const EffectItem = styled.div`
  background-color: ${props => props.selected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const EffectIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const EffectName = styled.div`
  font-size: 0.9rem;
`;

const OptionsContainer = styled.div`
  margin-top: 15px;
`;

const OptionItem = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
`;

const CheckboxContainer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  background-color: ${props => props.checked ? '#4CAF50' : 'transparent'};
  transition: all 0.2s;
`;

const CheckMark = styled.div`
  color: white;
  font-size: 14px;
  display: ${props => props.checked ? 'block' : 'none'};
`;

const OptionLabel = styled.span``;

function SmokeEffectTypeSettings({ smokeSettings, setSmokeSettings }) {
  const effectTypes = [
    { id: 'normal', name: '標準', icon: '💨' },
    { id: 'explosion', name: '爆発', icon: '💥' },
    { id: 'spiral', name: '螺旋', icon: '🌀' },
    { id: 'fountain', name: '噴水', icon: '⛲' },
    { id: 'ring', name: 'リング', icon: '⭕' },
    { id: 'bubble', name: '泡', icon: '🫧' },
    { id: 'cloud', name: '霧', icon: '☁️' }
  ];
  
  const handleEffectTypeChange = (effectType) => {
    setSmokeSettings({
      ...smokeSettings,
      effectType
    });
  };
  
  const toggleOption = (option) => {
    setSmokeSettings({
      ...smokeSettings,
      options: {
        ...smokeSettings.options,
        [option]: !smokeSettings.options[option]
      }
    });
  };
  
  return (
    <SettingsGroup>
      <h4>煙のエフェクトタイプ</h4>
      
      <EffectContainer>
        {effectTypes.map(effect => (
          <EffectItem 
            key={effect.id}
            selected={smokeSettings.effectType === effect.id}
            onClick={() => handleEffectTypeChange(effect.id)}
          >
            <EffectIcon>{effect.icon}</EffectIcon>
            <EffectName>{effect.name}</EffectName>
          </EffectItem>
        ))}
      </EffectContainer>
      
      <OptionsContainer>
        <h5>追加オプション</h5>
        
        <OptionItem onClick={() => toggleOption('fade')}>
          <CheckboxContainer checked={smokeSettings.options.fade}>
            <CheckMark checked={smokeSettings.options.fade}>✓</CheckMark>
          </CheckboxContainer>
          <OptionLabel>フェードアウト効果</OptionLabel>
        </OptionItem>
        
        <OptionItem onClick={() => toggleOption('gravity')}>
          <CheckboxContainer checked={smokeSettings.options.gravity}>
            <CheckMark checked={smokeSettings.options.gravity}>✓</CheckMark>
          </CheckboxContainer>
          <OptionLabel>重力効果</OptionLabel>
        </OptionItem>
        
        <OptionItem onClick={() => toggleOption('pulsate')}>
          <CheckboxContainer checked={smokeSettings.options.pulsate}>
            <CheckMark checked={smokeSettings.options.pulsate}>✓</CheckMark>
          </CheckboxContainer>
          <OptionLabel>脈動効果</OptionLabel>
        </OptionItem>
        
        <OptionItem onClick={() => toggleOption('trail')}>
          <CheckboxContainer checked={smokeSettings.options.trail}>
            <CheckMark checked={smokeSettings.options.trail}>✓</CheckMark>
          </CheckboxContainer>
          <OptionLabel>軌跡効果</OptionLabel>
        </OptionItem>
      </OptionsContainer>
    </SettingsGroup>
  );
}

export default SmokeEffectTypeSettings;