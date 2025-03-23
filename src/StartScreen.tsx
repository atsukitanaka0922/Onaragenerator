// components/StartScreen.tsx
import React from 'react';
import styled from 'styled-components';

const ScreenContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 100;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 0.5rem;
`;

const StartButton = styled.button`
  padding: 15px 30px;
  font-size: 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background-color: #45a049;
  }
`;

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <ScreenContainer>
      <Title>高機能煙エフェクトアプリ</Title>
      <Description>画面をタップして煙を発生させよう！</Description>
      <Description>⚙️ボタンで背景と煙の詳細設定、📍ボタンで煙の発生地点を設定できます</Description>
      <StartButton onClick={onStart}>スタート</StartButton>
    </ScreenContainer>
  );
};

export default StartScreen;