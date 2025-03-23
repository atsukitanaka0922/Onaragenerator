// 煙の設定タイプ
export interface SmokeSettings {
    size: number;
    count: number;
    speed: number;
    duration: number;
    effectType: 'normal' | 'explosion' | 'spiral' | 'fountain' | 'ring';
    options: {
      fade: boolean;
      gravity: boolean;
      pulsate: boolean;
      trail: boolean;
    };
  }
  
  // 色設定タイプ
  export interface ColorSettings {
    mainColor: string;
    subColor1: string;
    subColor2: string;
    blendMode: 'gradient' | 'random' | 'stripe' | 'pulse';
  }
  
  // スポーン地点タイプ
  export interface SpawnPoint {
    id: number;
    x: number;
    y: number;
  }
  
  // サウンド情報タイプ
  export interface Sound {
    id: number;
    name: string;
    file: File;
    waveform?: number[];
  }