import React from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const SliderContainer = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const SliderLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const SliderValue = styled.span`
  min-width: 30px;
  text-align: right;
`;

const Slider = styled.input`
  width: 100%;
`;

function SmokeParameterSettings({ smokeSettings, setSmokeSettings }) {
  // スライダー値の変更ハンドラ
  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setSmokeSettings({
      ...smokeSettings,
      size
    });
  };
  
  const handleCountChange = (e) => {
    const count = parseInt(e.target.value);
    setSmokeSettings({
      ...smokeSettings,
      count
    });
  };
  
  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setSmokeSettings({
      ...smokeSettings,
      speed
    });
  };
  
  const handleDurationChange = (e) => {
    const duration = parseFloat(e.target.value);
    setSmokeSettings({
      ...smokeSettings,
      duration
    });
  };
  
  const handleBurstIntervalChange = (e) => {
    const burstInterval = parseInt(e.target.value);
    setSmokeSettings({
      ...smokeSettings,
      burstInterval
    });
  };
  
  return (
    <SettingsGroup>
      <h4>煙のパラメータ</h4>
      
      <SliderContainer>
        <SliderLabel>
          サイズ
          <SliderValue>{smokeSettings.size}</SliderValue>
        </SliderLabel>
        <Slider 
          type="range" 
          min="10" 
          max="150" 
          value={smokeSettings.size} 
          onChange={handleSizeChange}
        />
      </SliderContainer>
      
      <SliderContainer>
        <SliderLabel>
          個数
          <SliderValue>{smokeSettings.count}</SliderValue>
        </SliderLabel>
        <Slider 
          type="range" 
          min="1" 
          max="15" 
          value={smokeSettings.count} 
          onChange={handleCountChange}
        />
      </SliderContainer>
      
      <SliderContainer>
        <SliderLabel>
          初速
          <SliderValue>{smokeSettings.speed.toFixed(1)}</SliderValue>
        </SliderLabel>
        <Slider 
          type="range" 
          min="0.2" 
          max="3.0" 
          step="0.1" 
          value={smokeSettings.speed} 
          onChange={handleSpeedChange}
        />
      </SliderContainer>
      
      <SliderContainer>
        <SliderLabel>
          持続時間
          <SliderValue>{smokeSettings.duration.toFixed(1)}</SliderValue>
        </SliderLabel>
        <Slider 
          type="range" 
          min="0.5" 
          max="10.0" 
          step="0.5" 
          value={smokeSettings.duration} 
          onChange={handleDurationChange}
        />
      </SliderContainer>
      
      <SliderContainer>
        <SliderLabel>
          連続発射間隔
          <SliderValue>{smokeSettings.burstInterval}ms</SliderValue>
        </SliderLabel>
        <Slider 
          type="range" 
          min="100" 
          max="1000" 
          step="50"
          value={smokeSettings.burstInterval} 
          onChange={handleBurstIntervalChange}
        />
      </SliderContainer>
    </SettingsGroup>
  );
}

export default SmokeParameterSettings;