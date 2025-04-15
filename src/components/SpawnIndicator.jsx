import React from 'react';
import styled from 'styled-components';

const IndicatorContainer = styled.div`
  position: fixed;
  bottom: 60px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 10px;
  color: white;
  z-index: 100;
  font-size: 0.8rem;
  pointer-events: none;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

// スポーン地点の情報を表示するインジケーター
function SpawnIndicator({ isVisible, spawnPoints }) {
  // アクティブなスポーン地点の数
  const activeCount = spawnPoints.filter(p => p.active !== false).length;
  
  return (
    <IndicatorContainer isVisible={isVisible}>
      <div>スポーン地点: {spawnPoints.length}個（有効: {activeCount}個）</div>
      <div>ドラッグして位置を調整できます</div>
    </IndicatorContainer>
  );
}

export default SpawnIndicator;