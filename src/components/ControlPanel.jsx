import styled from 'styled-components';

const PanelContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
`;

const ControlButton = styled.button`
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  background: ${props => props.active ? 'rgba(255, 87, 34, 0.7)' : 'transparent'};
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

function ControlPanel({ 
  isSoundOn, 
  setIsSoundOn, 
  isSettingsPanelOpen, 
  setIsSettingsPanelOpen,
  isSettingSpawn,
  setIsSettingSpawn
}) {
  return (
    <PanelContainer>
      <ControlButton 
        onClick={() => setIsSoundOn(!isSoundOn)}
      >
        {isSoundOn ? '🔊' : '🔇'}
      </ControlButton>
      
      <ControlButton 
        active={isSettingsPanelOpen}
        onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
      >
        ⚙️
      </ControlButton>
      
      <ControlButton 
        active={isSettingSpawn}
        onClick={() => setIsSettingSpawn(!isSettingSpawn)}
      >
        📍
      </ControlButton>
    </PanelContainer>
  );
}

export default ControlPanel;