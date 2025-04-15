import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Point = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 2px dashed ${props => props.color || '#FF5722'};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #000;
  cursor: ${props => props.isDraggable ? 'move' : 'default'};
  z-index: 10;
  user-select: none;
  opacity: ${props => props.isActive ? 1 : 0.4};
  touch-action: none;
`;

function SpawnPoint({ 
  id, 
  x, 
  y, 
  color = '#FF5722',
  isActive = true,
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
    
    // ドラッグ中フラグを立てる
    isDragging.current = true;
    
    // クリック位置とスポーン地点の位置の差分を計算
    const pointRect = pointRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - pointRect.left - pointRect.width / 2,
      y: e.clientY - pointRect.top - pointRect.height / 2
    };
    
    // イベントのデフォルト動作を防止
    e.preventDefault();
    e.stopPropagation();
  };

  // タッチ開始ハンドラ
  const handleTouchStart = (e) => {
    if (!isDraggable) return;
    
    // ドラッグ中フラグを立てる
    isDragging.current = true;
    
    // タッチ位置とスポーン地点の位置の差分を計算
    const pointRect = pointRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    
    offset.current = {
      x: touch.clientX - pointRect.left - pointRect.width / 2,
      y: touch.clientY - pointRect.top - pointRect.height / 2
    };
    
    // イベントのデフォルト動作を防止
    e.preventDefault();
    e.stopPropagation();
  };

  // グローバルのマウス/タッチ移動イベントをリッスン
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      
      // 移動距離を計算
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      
      // 内部状態を更新（表示位置）
      setPosition({ x: newX, y: newY });
      
      // 親コンポーネントに通知
      if (onPositionChange) {
        onPositionChange(id, newX, newY);
      }
    };
    
    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      
      // 移動距離を計算
      const touch = e.touches[0];
      const newX = touch.clientX - offset.current.x;
      const newY = touch.clientY - offset.current.y;
      
      // 内部状態を更新（表示位置）
      setPosition({ x: newX, y: newY });
      
      // 親コンポーネントに通知
      if (onPositionChange) {
        onPositionChange(id, newX, newY);
      }
      
      // スクロールを防止
      e.preventDefault();
    };
    
    const handleMouseUp = () => {
      // ドラッグ終了
      isDragging.current = false;
    };
    
    const handleTouchEnd = () => {
      // ドラッグ終了
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
      color={color}
      isActive={isActive}
      isDraggable={isDraggable}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {id}
    </Point>
  );
}

export default SpawnPoint;