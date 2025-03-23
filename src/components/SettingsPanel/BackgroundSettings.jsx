import { useRef } from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const FileInput = styled.input`
  width: 100%;
  margin-bottom: 10px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 5px;
  display: ${props => props.src ? 'block' : 'none'};
`;

const PresetBackgrounds = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const PresetBg = styled.div`
  width: 60px;
  height: 40px;
  background-size: cover;
  background-position: center;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#4CAF50' : 'transparent'};
`;

const ClearButton = styled.button`
  padding: 8px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
`;

// プリセット背景の定義
const presets = [
  { id: 'sky', url: 'https://source.unsplash.com/featured/?sky', label: '空' },
  { id: 'beach', url: 'https://source.unsplash.com/featured/?beach', label: '海' },
  { id: 'garden', url: 'https://source.unsplash.com/featured/?garden', label: '庭' },
  { id: 'forest', url: 'https://source.unsplash.com/featured/?forest', label: '森' },
  { id: 'night', url: 'https://source.unsplash.com/featured/?night', label: '夜' },
  { id: 'city', url: 'https://source.unsplash.com/featured/?city', label: '街' }
];

function BackgroundSettings({ backgroundImage, setBackgroundImage }) {
  const fileInputRef = useRef(null);
  
  // 背景画像ファイル選択ハンドラ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // プリセット背景選択ハンドラ
  const handlePresetClick = (presetUrl) => {
    setBackgroundImage(presetUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ファイル選択をリセット
    }
  };
  
  // 背景クリアハンドラ
  const handleClearBackground = () => {
    setBackgroundImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 現在選択されているプリセットかどうかを判定
  const isActivePreset = (url) => {
    return backgroundImage === url;
  };
  
  return (
    <SettingsGroup>
      <h4>背景画像設定</h4>
      
      <FileInput 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      <ImagePreview 
        src={backgroundImage && !presets.some(p => p.url === backgroundImage) ? backgroundImage : ''} 
        alt="背景プレビュー" 
      />
      
      <div>
        <label>プリセット背景</label>
        <PresetBackgrounds>
          {presets.map(preset => (
            <PresetBg 
              key={preset.id}
              style={{ backgroundImage: `url(${preset.url})` }}
              active={isActivePreset(preset.url)}
              onClick={() => handlePresetClick(preset.url)}
              title={preset.label}
            />
          ))}
        </PresetBackgrounds>
      </div>
      
      <ClearButton onClick={handleClearBackground}>
        背景をクリア
      </ClearButton>
    </SettingsGroup>
  );
}

export default BackgroundSettings;