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
  padding: 5px;
  margin-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    margin-bottom: 0;
  }
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
  background-color: ${props => props.remove ? '#f44336' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
`;

const SpawnPointActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

function SpawnPointSettings({ 
  spawnPoints, 
  addSpawnPoint, 
  removeSpawnPoint, 
  removeAllSpawnPoints 
}) {
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
  
  return (
    <SettingsGroup>
      <h4>スポーン地点</h4>
      
      <SpawnPointActions>
        <ActionButton onClick={handleAddSpawnPoint}>
          スポーン地点を追加
        </ActionButton>
        <ActionButton remove onClick={handleRemoveAllSpawnPoints}>
          全て削除
        </ActionButton>
      </SpawnPointActions>
      
      <SpawnPointsList>
        {spawnPoints.length === 0 ? (
          <SpawnPointItem>スポーン地点がありません</SpawnPointItem>
        ) : (
          spawnPoints.map(point => (
            <SpawnPointItem key={point.id}>
              <span>スポーン地点 #{point.id}</span>
              <RemoveButton onClick={() => removeSpawnPoint(point.id)}>
                削除
              </RemoveButton>
            </SpawnPointItem>
          ))
        )}
      </SpawnPointsList>
    </SettingsGroup>
  );
}

export default SpawnPointSettings;