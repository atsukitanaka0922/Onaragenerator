import React, { useState } from 'react';
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

const ColorPickerPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 300px;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const ColorOption = styled.div`
  width: 100%;
  padding-bottom: 100%; /* 正方形にする */
  border-radius: 5px;
  background-color: ${props => props.color};
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const CustomColorInput = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props.primary ? '#4CAF50' : '#f44336'};
  color: white;
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

// 基本カラーパレット
const colorPalette = [
  '#ff0000', '#ff4500', '#ffa500', '#ffff00', '#ffeb3b', 
  '#00ff00', '#00fa9a', '#00ffff', '#00bfff', '#0000ff',
  '#8a2be2', '#9400d3', '#ff00ff', '#ff69b4', '#ff1493',
  '#ffffff', '#c0c0c0', '#808080', '#404040', '#000000'
];

function ColorSettings({ colorSettings, setColorSettings }) {
  // モーダル状態
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentEditingColor, setCurrentEditingColor] = useState('main'); // 'main' または 'sub'
  const [tempColor, setTempColor] = useState('#ffffff');
  
  // カラーピッカーを開く
  const openColorPicker = (colorType) => {
    setCurrentEditingColor(colorType);
    setTempColor(colorType === 'main' ? colorSettings.mainColor : colorSettings.subColor);
    setShowColorPicker(true);
  };
  
  // カラーピッカーを閉じる
  const closeColorPicker = () => {
    setShowColorPicker(false);
  };
  
  // 色を選択して適用
  const applyColor = () => {
    if (currentEditingColor === 'main') {
      setColorSettings({
        ...colorSettings,
        mainColor: tempColor
      });
    } else {
      setColorSettings({
        ...colorSettings,
        subColor: tempColor
      });
    }
    closeColorPicker();
  };
  
  // パレットから色を選択
  const selectPaletteColor = (color) => {
    setTempColor(color);
  };
  
  // カスタム色の入力
  const handleCustomColorChange = (e) => {
    setTempColor(e.target.value);
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
          onClick={() => openColorPicker('main')}
        />
      </ColorSlot>
      
      {/* サブカラー */}
      <ColorSlot>
        <ColorLabel>サブカラー:</ColorLabel>
        <ColorPreview 
          color={colorSettings.subColor} 
          onClick={() => openColorPicker('sub')}
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
      
      {/* カラーピッカーモーダル */}
      <ColorPickerPopup show={showColorPicker}>
        <PopupContent>
          <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>
            {currentEditingColor === 'main' ? 'メインカラーを選択' : 'サブカラーを選択'}
          </h3>
          
          <ColorGrid>
            {colorPalette.map((color, index) => (
              <ColorOption 
                key={index} 
                color={color} 
                onClick={() => selectPaletteColor(color)}
                style={{ 
                  border: color === tempColor ? '2px solid white' : 'none',
                  boxShadow: color === tempColor ? '0 0 5px white' : 'none'
                }}
              />
            ))}
          </ColorGrid>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>カスタムカラー:</label>
            <CustomColorInput 
              type="color" 
              value={tempColor}
              onChange={handleCustomColorChange}
            />
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <ColorPreview 
              color={tempColor} 
              style={{ 
                width: '50px', 
                height: '50px', 
                margin: '0 auto',
                border: '3px solid white'
              }} 
            />
            <div style={{ marginTop: '5px' }}>{tempColor}</div>
          </div>
          
          <ButtonContainer>
            <Button onClick={closeColorPicker}>キャンセル</Button>
            <Button primary onClick={applyColor}>適用</Button>
          </ButtonContainer>
        </PopupContent>
      </ColorPickerPopup>
    </SettingsGroup>
  );
}

export default ColorSettings;