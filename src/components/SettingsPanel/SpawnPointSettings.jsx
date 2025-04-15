import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const SpawnPointsList = styled.div`
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 5px;
`;

const SpawnPointItem = styled.div`
  padding: 8px;
  margin-bottom: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SpawnPointHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SpawnPointColor = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ColorPreview = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: ${props => props.color};
  cursor: pointer;
`;

const RemoveButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 3px 8px;
  cursor: pointer;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.remove ? '#f44336' : props.selected ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: ${props => props.remove ? '#d32f2f' : props.selected ? '#388e3c' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const SpawnPointActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const SectionDivider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 15px 0;
`;

const SpawnModesContainer = styled.div`
  margin: 15px 0;
`;

const ModeTitle = styled.h5`
  margin-bottom: 8px;
  font-weight: 500;
`;

const ModesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 10px;
`;

const ActiveToggle = styled.label`
  display: flex;
  align-items: center;
  margin-top: 5px;
  gap: 5px;
  cursor: pointer;
`;

const ColorPicker = styled.input`
  width: 0;
  height: 0;
  visibility: hidden;
  position: absolute;
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

function SpawnPointSettings({ 
  spawnPoints, 
  addSpawnPoint, 
  removeSpawnPoint, 
  removeAllSpawnPoints,
  updateSpawnPointColor,
  updateSpawnPointActive,
  activateAllSpawnPoints,
  deactivateAllSpawnPoints,
  spawnMode,
  setSpawnMode
}) {
  const [editingColorId, setEditingColorId] = useState(null);
  const [tempColor, setTempColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // 基本カラーパレット
  const colorPalette = [
    '#ff0000', '#ff4500', '#ffa500', '#ffff00', '#ffeb3b', 
    '#00ff00', '#00fa9a', '#00ffff', '#00bfff', '#0000ff',
    '#8a2be2', '#9400d3', '#ff00ff', '#ff69b4', '#ff1493',
    '#ffffff', '#c0c0c0', '#808080', '#404040', '#000000'
  ];
  
  // 新しいスポーン地点を追加
  const handleAddSpawnPoint = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    addSpawnPoint(centerX, centerY);
  };
  
  // 全てのスポーン地点を削除
  const handleRemoveAllSpawnPoints = () => {
    if (confirm('全てのスポーン地点を削除しますか？')) {
      removeAllSpawnPoints();
    }
  };
  
  // スポーン地点の色編集を開始
  const handleEditColor = (id, currentColor) => {
    setEditingColorId(id);
    setTempColor(currentColor);
    setShowColorPicker(true);
  };
  
  // 色の選択をキャンセル
  const handleCancelColorEdit = () => {
    setShowColorPicker(false);
    setEditingColorId(null);
  };
  
  // 選択した色を適用
  const handleApplyColor = () => {
    if (editingColorId) {
      updateSpawnPointColor(editingColorId, tempColor);
    }
    setShowColorPicker(false);
    setEditingColorId(null);
  };
  
  // パレットから色を選択
  const selectPaletteColor = (color) => {
    setTempColor(color);
  };
  
  // スポーン地点のアクティブ状態を切り替え
  const toggleSpawnPointActive = (id, currentActive) => {
    updateSpawnPointActive(id, !currentActive);
  };
  
  return (
    <SettingsGroup>
      <h4>スポーン地点</h4>
      
      <SpawnPointActions>
        <ActionButton onClick={handleAddSpawnPoint}>
          スポーン地点を追加
        </ActionButton>
        <ActionButton remove onClick={handleRemoveAllSpawnPoints} disabled={spawnPoints.length === 0}>
          全て削除
        </ActionButton>
      </SpawnPointActions>
      
      <SpawnModesContainer>
        <ModeTitle>発生方式</ModeTitle>
        <ModesGrid>
          <ActionButton 
            selected={spawnMode === 'simultaneous'}
            onClick={() => setSpawnMode('simultaneous')}
          >
            同時発生
          </ActionButton>
          <ActionButton 
            selected={spawnMode === 'sequential'}
            onClick={() => setSpawnMode('sequential')}
          >
            順番に発生
          </ActionButton>
          <ActionButton 
            selected={spawnMode === 'random'}
            onClick={() => setSpawnMode('random')}
          >
            ランダムに発生
          </ActionButton>
          <ActionButton 
            selected={spawnMode === 'randomMix'}
            onClick={() => setSpawnMode('randomMix')}
          >
            ランダム+同時
          </ActionButton>
        </ModesGrid>
        
        <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '5px' }}>
          {spawnMode === 'simultaneous' ? '複数のスポーン地点から同時におならが発生します' :
           spawnMode === 'sequential' ? 'スポーン地点から順番におならが発生します' :
           spawnMode === 'random' ? '有効なスポーン地点からランダムに1つだけおならが発生します' :
           '複数のスポーン地点からランダムに選ばれた1～全部のスポーン地点から同時発生します'}
        </div>
      </SpawnModesContainer>
      
      <SpawnPointActions>
        <ActionButton onClick={activateAllSpawnPoints} disabled={spawnPoints.length === 0}>
          全て有効化
        </ActionButton>
        <ActionButton onClick={deactivateAllSpawnPoints} disabled={spawnPoints.length === 0}>
          全て無効化
        </ActionButton>
      </SpawnPointActions>
      
      <SectionDivider />
      
      <SpawnPointsList>
        {spawnPoints.length === 0 ? (
          <SpawnPointItem>スポーン地点がありません</SpawnPointItem>
        ) : (
          spawnPoints.map(point => (
            <SpawnPointItem key={point.id}>
              <SpawnPointHeader>
                <SpawnPointColor>
                  <ColorPreview 
                    color={point.color}
                    onClick={() => handleEditColor(point.id, point.color)} 
                  />
                  <span>スポーン地点 #{point.id}</span>
                </SpawnPointColor>
                <RemoveButton onClick={() => removeSpawnPoint(point.id)}>
                  削除
                </RemoveButton>
              </SpawnPointHeader>
              
              <ActiveToggle>
                <input 
                  type="checkbox" 
                  checked={point.active !== false} 
                  onChange={() => toggleSpawnPointActive(point.id, point.active !== false)}
                />
                有効にする
              </ActiveToggle>
            </SpawnPointItem>
          ))
        )}
      </SpawnPointsList>
      
      {/* カラーピッカーモーダル */}
      <ColorPickerPopup show={showColorPicker}>
        <PopupContent>
          <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>
            スポーン地点の色を選択
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
            <Button onClick={handleCancelColorEdit}>キャンセル</Button>
            <Button primary onClick={handleApplyColor}>適用</Button>
          </ButtonContainer>
        </PopupContent>
      </ColorPickerPopup>
    </SettingsGroup>
  );
}

export default SpawnPointSettings;