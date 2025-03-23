import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Point = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 2px dashed #FF5722;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #000;
  cursor: move;
  z-index: 10;
  user-select: none;
`;

function SpawnPoint({ 
  id, 
  x, 
  y, 
  isVisible, 
  isDraggable, 
  onPositionChange 
}) {
  const [position, setPosition] = useState({ x, y });
  const pointRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // 親から受け取った位置が変わったら更新
  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  // ドラッグ開始ハンドラ
  const handleMouseDown = (e) => {
    if (!isDraggable) return;
    
    isDragging.current = true;
    
    // クリック位置とスポーン地点の位置の差分を計算
    const pointRect = pointRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - pointRect.left - pointRect.width / 2,
      y: e.clientY - pointRect.top - pointRect.height / 2
    };
    
    e.preventDefault();
    e.stopPropagation();
  };

  // タッチ開始ハンドラ
  const handleTouchStart = (e) => {
    if (!isDraggable) return;
    
    isDragging.current = true;
    
    // タッチ位置とスポーン地点の位置の差分を計算
    const pointRect = pointRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    
    offset.current = {
      x: touch.clientX - pointRect.left - pointRect.width / 2,
      y: touch.clientY - pointRect.top - pointRect.height / 2
    };
    
    e.preventDefault();
    e.stopPropagation();
  };

  // グローバルのマウス移動イベントをリッスン
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      
      setPosition({ x: newX, y: newY });
      
      if (onPositionChange) {
        onPositionChange(id, newX, newY);
      }
    };
    
    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      
      const touch = e.touches[0];
      const newX = touch.clientX - offset.current.x;
      const newY = touch.clientY - offset.current.y;
      
      setPosition({ x: newX, y: newY });
      
      if (onPositionChange) {
        onPositionChange(id, newX, newY);
      }
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    const handleTouchEnd = () => {
      isDragging.current = false;
    };
    
    // イベントリスナーを追加
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // クリーンアップ関数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [id, onPositionChange]);

  return (
    <Point
      ref={pointRef}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        display: isVisible ? 'flex' : 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {id}
    </Point>
  );
}

export default SpawnPoint;