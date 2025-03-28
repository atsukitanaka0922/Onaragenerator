import { useRef, useState } from 'react';
import styled from 'styled-components';

const SettingsGroup = styled.div`
  margin-bottom: 15px;
`;

const FileInput = styled.input`
  width: 100%;
  margin-bottom: 10px;
`;

const URLInputContainer = styled.div`
  margin-bottom: 15px;
`;

const URLInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
`;

const URLButton = styled.button`
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
  &:hover {
    background-color: #45a049;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
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

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 5px;
`;

function BackgroundSettings({ backgroundImage, setBackgroundImage }) {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  
  // プリセット背景
  const presets = [
    { id: 'sky', url: 'https://source.unsplash.com/featured/?sky', label: '空' },
    { id: 'beach', url: 'https://source.unsplash.com/featured/?beach', label: '海' },
    { id: 'garden', url: 'https://source.unsplash.com/featured/?garden', label: '庭' },
    { id: 'forest', url: 'https://source.unsplash.com/featured/?forest', label: '森' },
    { id: 'night', url: 'https://source.unsplash.com/featured/?night', label: '夜' },
    { id: 'city', url: 'https://source.unsplash.com/featured/?city', label: '街' }
  ];
  
  // 背景画像ファイル選択ハンドラ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };
  
  // URL入力ハンドラ
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setError('');
  };
  
  // URL画像を適用
  const applyUrlImage = () => {
    if (!imageUrl) {
      setError('URLを入力してください');
      return;
    }
    
    // CORS対策でイメージの存在チェック
    const img = new Image();
    img.onload = () => {
      setBackgroundImage(imageUrl);
      setError('');
    };
    img.onerror = () => {
      setError('画像の読み込みに失敗しました。URLが正しいか確認してください。');
    };
    
    // 画像読み込みを試行
    img.src = imageUrl;
  };
  
  // プリセット背景選択ハンドラ
  const handlePresetClick = (presetUrl) => {
    setBackgroundImage(presetUrl);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ファイル選択をリセット
    }
    setImageUrl(''); // URL入力もリセット
  };
  
  // 背景クリアハンドラ
  const handleClearBackground = () => {
    setBackgroundImage('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageUrl('');
  };
  
  // 現在選択されているプリセットかどうかを判定
  const isActivePreset = (url) => {
    return backgroundImage === url;
  };
  
  return (
    <SettingsGroup>
      <h4>背景画像設定</h4>
      
      {/* ファイル選択 */}
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>画像ファイルから:</label>
        <FileInput 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
      
      {/* URL入力 */}
      <URLInputContainer>
        <label style={{ display: 'block', marginBottom: '5px' }}>画像URLから:</label>
        <URLInput 
          type="text"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={handleUrlChange}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <URLButton onClick={applyUrlImage}>URLから画像を適用</URLButton>
      </URLInputContainer>
      
      {/* 画像プレビュー */}
      <ImagePreview 
        src={backgroundImage && !presets.some(p => p.url === backgroundImage) ? backgroundImage : ''} 
        alt="背景プレビュー" 
      />
      
      {/* プリセット背景 */}
      <div>
        <label>プリセット背景:</label>
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
      
      {/* 背景をクリア */}
      <ClearButton onClick={handleClearBackground}>
        背景をクリア
      </ClearButton>
    </SettingsGroup>
  );
}

export default BackgroundSettings;