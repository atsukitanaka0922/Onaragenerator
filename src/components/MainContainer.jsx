import { useRef } from 'react';
import styled from 'styled-components';

// コンポーネント外でスタイル定義を修正
const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'linear-gradient(to bottom, #87CEEB, #E0F7FA)'};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #000;
  overflow: hidden;
  box-sizing: border-box;
`;

function MainContainer({ 
  backgroundImage, 
  onInteraction,
  isSettingSpawn,
  children
}) {
  const containerRef = useRef(null);
  const lastClickTime = useRef(0);

  // クリックハンドラ - 連打防止機能付き
  const handleClick = (e) => {
    // 設定モード中は処理しない
    if (isSettingSpawn) {
      console.log('設定モード中のためクリックイベントを無視');
      return;
    }
    
    // 連続クリックを防止（300ms以内の連続クリックは無視）
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      console.log('クリックが早すぎるため無視します');
      return;
    }
    lastClickTime.current = now;
    
    // 座標を取得
    const x = e.clientX;
    const y = e.clientY;
    
    console.log(`クリック検出: x=${x}, y=${y}`);
    
    // 親コンポーネントに通知 - 明示的に位置を渡す
    if (onInteraction) {
      onInteraction(x, y);
    }
    
    // バブリングを停止
    e.stopPropagation();
  };

  return (
    <Container 
      ref={containerRef}
      backgroundImage={backgroundImage}
      onClick={handleClick}
    >
      {children}
    </Container>
  );
}

export default MainContainer;