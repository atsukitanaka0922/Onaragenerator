import React from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const ColorSlot = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

const ColorLabel = styled.div`
  min-width: 80px;
`;

const ColorPreview = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  overflow: hidden;
  background-color: ${props => props.color};
`;

const ColorInput = styled.input`
  width: 0;
  height: 0;
  visibility: hidden;
`;

const BlendOptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const BlendButton = styled.button`
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

const GradientPreview = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  margin-top: 10px;
  background: ${props => props.gradient};
`;

function ColorSettings({ colorSettings, setColorSettings }) {
  // 色の変更ハンドラ
  const handleMainColorChange = (e) => {
    setColorSettings({
      ...colorSettings,
      mainColor: e.target.value
    });
  };
  
  const handleSubColorChange = (e) => {
    setColorSettings({
      ...colorSettings,
      subColor: e.target.value
    });
  };
  
  // ブレンドモード変更ハンドラ
  const handleBlendModeChange = (mode) => {
    setColorSettings({
      ...colorSettings,
      blendMode: mode
    });
  };
  
  // グラデーションプレビューの計算
  const getGradientPreview = () => {
    const { mainColor, subColor, blendMode } = colorSettings;
    
    switch (blendMode) {
      case 'gradient':
        return `linear-gradient(to right, ${mainColor}, ${subColor})`;
      case 'random':
        // ランダムの場合も同様のグラデーションを表示
        return `linear-gradient(to right, ${mainColor}, ${subColor})`;
      case 'stripe':
        return `repeating-linear-gradient(45deg, ${mainColor}, ${mainColor} 10px, ${subColor} 10px, ${subColor} 20px)`;
      case 'pulse':
        // 点滅は静的には表現できないので、代わりにグラデーションで表示
        return `linear-gradient(to right, ${mainColor}, ${subColor})`;
      default:
        return `linear-gradient(to right, ${mainColor}, ${subColor})`;
    }
  };
  
  return (
    <SettingsGroup>
      <h4>煙の色設定</h4>
      
      {/* メインカラー */}
      <ColorSlot>
        <ColorLabel>メインカラー:</ColorLabel>
        <ColorPreview 
          color={colorSettings.mainColor} 
          onClick={() => document.getElementById('main-color-input').click()} 
        />
        <ColorInput 
          id="main-color-input"
          type="color" 
          value={colorSettings.mainColor} 
          onChange={handleMainColorChange} 
        />
      </ColorSlot>
      
      {/* サブカラー */}
      <ColorSlot>
        <ColorLabel>サブカラー:</ColorLabel>
        <ColorPreview 
          color={colorSettings.subColor} 
          onClick={() => document.getElementById('sub-color-input').click()} 
        />
        <ColorInput 
          id="sub-color-input"
          type="color" 
          value={colorSettings.subColor} 
          onChange={handleSubColorChange} 
        />
      </ColorSlot>
      
      {/* カラーブレンドモード */}
      <div style={{ marginTop: '15px' }}>
        <label>カラーブレンドモード</label>
        <BlendOptionsContainer>
          <BlendButton 
            active={colorSettings.blendMode === 'gradient'}
            onClick={() => handleBlendModeChange('gradient')}
          >
            グラデーション
          </BlendButton>
          <BlendButton 
            active={colorSettings.blendMode === 'random'}
            onClick={() => handleBlendModeChange('random')}
          >
            ランダム
          </BlendButton>
          <BlendButton 
            active={colorSettings.blendMode === 'stripe'}
            onClick={() => handleBlendModeChange('stripe')}
          >
            ストライプ
          </BlendButton>
          <BlendButton 
            active={colorSettings.blendMode === 'pulse'}
            onClick={() => handleBlendModeChange('pulse')}
          >
            交互に点滅
          </BlendButton>
        </BlendOptionsContainer>
      </div>
      
      {/* グラデーションプレビュー */}
      <GradientPreview gradient={getGradientPreview()} />
    </SettingsGroup>
  );
}

export default ColorSettings;