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

const EffectDescription = styled.div`
  font-size: 0.9rem;
  margin-top: 10px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  line-height: 1.4;
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
  
  // 現在選択されているエフェクトタイプの説明を取得
  const getEffectDescription = () => {
    switch (smokeSettings.effectType) {
      case 'normal':
        return 'タップした場所に向かって煙が広がります。標準的なおならの動きを表現します。';
      case 'explosion':
        return 'スポーン地点から四方八方に煙が広がります。強力なおならを表現するのに適しています。';
      case 'spiral':
        return '螺旋状に煙が広がります。くるくると回転する特徴的なおならの動きを表現します。';
      case 'fountain':
        return '上方向に煙が噴き出します。勢いよく噴出するおならを表現するのに適しています。';
      case 'ring':
        return '円形に煙が広がります。均一に広がるおならの表現に最適です。';
      case 'bubble':
        return 'お風呂のような泡が上昇し、途中で弾けます。水中でのおならを表現します。「軌跡」をオンにすると泡が弾けるときに黄色い煙が出ます。';
      case 'cloud':
        return 'もやもやとした霧状のおならが広がります。「濃さ」や「ぼかし」は各オプションで調整できます。';
      default:
        return 'エフェクトタイプを選択してください。';
    }
  };
  
  // 各オプションの説明（現在のエフェクトタイプに応じて変わる）
  const getOptionDescription = (option) => {
    switch (option) {
      case 'fade':
        if (smokeSettings.effectType === 'bubble') {
          return '泡が徐々に透明になります';
        } else if (smokeSettings.effectType === 'cloud') {
          return '霧の濃さを濃くします';
        } else {
          return '煙が徐々に消えます';
        }
      case 'gravity':
        if (smokeSettings.effectType === 'cloud') {
          return '霧が上昇します';
        } else {
          return '煙が下に落ちていきます';
        }
      case 'pulsate':
        if (smokeSettings.effectType === 'cloud') {
          return '霧のぼかしを強くします';
        } else {
          return '煙がゆっくり脈動します';
        }
      case 'trail':
        if (smokeSettings.effectType === 'bubble') {
          return '泡が割れるときに黄色い煙を出します';
        } else if (smokeSettings.effectType === 'cloud') {
          return '霧の層の数を増やします';
        } else {
          return '煙の軌跡を残します';
        }
      default:
        return '';
    }
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
        <EffectButton 
          active={smokeSettings.effectType === 'bubble'}
          onClick={() => handleEffectTypeChange('bubble')}
        >
          泡
        </EffectButton>
        <EffectButton 
          active={smokeSettings.effectType === 'cloud'}
          onClick={() => handleEffectTypeChange('cloud')}
        >
          霧
        </EffectButton>
      </EffectButtons>
      
      <EffectDescription>
        {getEffectDescription()}
      </EffectDescription>
      
      <div style={{ marginTop: '15px' }}>
        <h4>エフェクトオプション</h4>
        <CheckboxOptions>
          <CheckboxLabel title={getOptionDescription('fade')}>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.fade} 
              onChange={(e) => handleOptionChange('fade', e.target.checked)} 
            />
            <div>
              フェード
              <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{getOptionDescription('fade')}</div>
            </div>
          </CheckboxLabel>
          <CheckboxLabel title={getOptionDescription('gravity')}>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.gravity} 
              onChange={(e) => handleOptionChange('gravity', e.target.checked)} 
            />
            <div>
              重力
              <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{getOptionDescription('gravity')}</div>
            </div>
          </CheckboxLabel>
          <CheckboxLabel title={getOptionDescription('pulsate')}>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.pulsate} 
              onChange={(e) => handleOptionChange('pulsate', e.target.checked)} 
            />
            <div>
              脈動
              <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{getOptionDescription('pulsate')}</div>
            </div>
          </CheckboxLabel>
          <CheckboxLabel title={getOptionDescription('trail')}>
            <input 
              type="checkbox" 
              checked={smokeSettings.options.trail} 
              onChange={(e) => handleOptionChange('trail', e.target.checked)} 
            />
            <div>
              軌跡
              <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{getOptionDescription('trail')}</div>
            </div>
          </CheckboxLabel>
        </CheckboxOptions>
      </div>
    </SettingsGroup>
  );
}

export default EffectTypeSettings;