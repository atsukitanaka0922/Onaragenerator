import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// アニメーションを生成する関数（コンポーネントの外部に定義）
const createAnimation = (dx, dy, scaleFactor, useGravity, pulsate, fade, trail, mainColor, subColor1, subColor2, blendMode) => {
  // 重力効果
  const gravityEffect = useGravity ? 2 * 200 : 0;
  
  // 脈動スケール
  const pulse25 = pulsate ? 1.2 : 1.0;
  const pulse50 = pulsate ? 0.9 : 1.0;
  const pulse75 = pulsate ? 1.2 : 1.0;
  
  return keyframes`
    0% {
      transform: translate(0, 0) scale(0.5);
      opacity: ${fade ? 0 : 0.7};
      filter: blur(5px);
      background-color: ${mainColor};
    }
    10% {
      opacity: 0.7;
      filter: blur(5px);
    }
    25% {
      transform: translate(${dx * 0.25 * scaleFactor}px, ${dy * 0.25 * scaleFactor}px) scale(${pulse25});
      background-color: ${blendMode === 'gradient' || blendMode === 'pulse' ? subColor1 : mainColor};
    }
    50% {
      transform: translate(${dx * 0.5 * scaleFactor}px, ${dy * 0.5 * scaleFactor}px) scale(${pulse50});
      background-color: ${blendMode === 'stripe' ? subColor2 : blendMode === 'pulse' ? subColor2 : subColor1};
    }
    75% {
      transform: translate(${dx * 0.75 * scaleFactor}px, ${dy * 0.75 * scaleFactor}px) scale(${pulse75});
      background-color: ${blendMode === 'gradient' ? subColor2 : blendMode === 'pulse' ? mainColor : subColor1};
    }
    100% {
      transform: translate(${dx * scaleFactor}px, ${dy * scaleFactor + gravityEffect}px) scale(1.5);
      opacity: ${fade ? 0 : 0.2};
      filter: blur(${trail ? '10px' : '5px'});
      background-color: ${subColor2};
    }
  `;
};

const Particle = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: ${props => props.hasTrail ? `0 0 10px 5px ${props.color}` : 'none'};
  animation: ${props => props.animation} ${props => props.duration}s ease-out forwards;
`;

function SmokeParticle({ 
  id, 
  spawnX, 
  spawnY, 
  targetX, 
  targetY, 
  settings, 
  colors, 
  onAnimationEnd, 
  sizeMultiplier = 1.0, 
  speedMultiplier = 1.0 
}) {
  // 煙のサイズを計算（サイズ乗数も適用）
  const size = settings.size * sizeMultiplier * (0.8 + Math.random() * 0.4);
  
  // 方向と距離を計算
  const dx = targetX - spawnX;
  const dy = targetY - spawnY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 持続時間を計算
  const duration = settings.duration * (0.8 + Math.random() * 0.4);
  
  // 初速に基づいて距離を調整（速度乗数も適用）
  const maxDistance = Math.max(window.innerWidth, window.innerHeight);
  const scaleFactor = (distance / maxDistance) * settings.speed * speedMultiplier * 1.5 + 0.3;
  
  // ブレンドモードに基づいて色を取得
  let initialColor;
  if (colors.blendMode === 'random') {
    const availableColors = [colors.mainColor, colors.subColor1, colors.subColor2];
    initialColor = availableColors[Math.floor(Math.random() * availableColors.length)];
  } else {
    initialColor = colors.mainColor;
  }
  
  // アニメーションの定義
  const animation = useMemo(() => {
    return createAnimation(
      dx, dy, scaleFactor, 
      settings.options.gravity,
      settings.options.pulsate,
      settings.options.fade,
      settings.options.trail,
      colors.mainColor,
      colors.subColor1,
      colors.subColor2,
      colors.blendMode
    );
  }, [
    dx, dy, scaleFactor, 
    settings.options.gravity,
    settings.options.pulsate,
    settings.options.fade,
    settings.options.trail,
    colors.mainColor,
    colors.subColor1,
    colors.subColor2,
    colors.blendMode
  ]);

  // アニメーション終了時の処理
  const handleAnimationEnd = () => {
    if (onAnimationEnd) {
      onAnimationEnd(id);
    }
  };

  return (
    <Particle
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${spawnX - size / 2}px`,
        top: `${spawnY - size / 2}px`,
        backgroundColor: initialColor,
      }}
      animation={animation}
      duration={duration}
      color={initialColor}
      hasTrail={settings.options.trail}
      onAnimationEnd={handleAnimationEnd}
    />
  );
}

export default SmokeParticle;