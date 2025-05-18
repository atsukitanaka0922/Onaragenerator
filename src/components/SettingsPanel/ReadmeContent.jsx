import React from 'react';
import styled from 'styled-components';

const ReadmeContainer = styled.div`
  line-height: 1.5;
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 5px;
  color: #4CAF50;
`;

const List = styled.ul`
  padding-left: 20px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const ListItem = styled.li`
  margin-bottom: 3px;
`;

const Highlight = styled.span`
  background-color: rgba(76, 175, 80, 0.2);
  padding: 2px 4px;
  border-radius: 3px;
`;

const NewFeatureBadge = styled.span`
  background-color: #ff5722;
  color: white;
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 10px;
  margin-left: 6px;
  vertical-align: middle;
  font-weight: bold;
`;

function ReadmeContent() {
  return (
    <ReadmeContainer>
      <Section>
        <SectionTitle>アプリの概要</SectionTitle>
        <p>このアプリは、画面をタップするとおならが発生する高機能なビジュアルエフェクトアプリです。色やエフェクトタイプ、効果音などをカスタマイズして、オリジナルのおならを作り出すことができます。</p>
      </Section>
      
      <Section>
        <SectionTitle>基本操作</SectionTitle>
        <List>
          <ListItem><Highlight>画面タップ</Highlight>: おならを発生させます</ListItem>
          <ListItem><Highlight>🔊</Highlight>: 効果音のオン/オフを切り替えます</ListItem>
          <ListItem><Highlight>⚙️</Highlight>: 設定パネルを開きます</ListItem>
          <ListItem><Highlight>📍</Highlight>: スポーン地点の表示/編集モードに切り替えます</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>各設定タブの説明</SectionTitle>
        <List>
          <ListItem><Highlight>背景</Highlight>: 背景画像をカスタマイズできます</ListItem>
          <ListItem><Highlight>おなら</Highlight>: おならのサイズ、個数、速度、持続時間を調整できます</ListItem>
          <ListItem><Highlight>色</Highlight>: おならの色とブレンドモードを設定できます</ListItem>
          <ListItem><Highlight>エフェクト</Highlight>: おならのエフェクトタイプとオプションを選択できます</ListItem>
          <ListItem><Highlight>効果音</Highlight>: おならが発生する際の効果音を設定できます</ListItem>
          <ListItem><Highlight>スポーン</Highlight>: おならの発生地点を管理できます</ListItem>
          <ListItem><Highlight>表示</Highlight>: 煙表示、効果音、振動、画面振動などの出力設定を調整できます <NewFeatureBadge>新機能</NewFeatureBadge></ListItem>
          <ListItem><Highlight>自動</Highlight>: 自動おなら機能の設定ができます</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>エフェクトタイプ</SectionTitle>
        <List>
          <ListItem><Highlight>標準</Highlight>: タップした場所に向かって煙が広がります</ListItem>
          <ListItem><Highlight>爆発</Highlight>: スポーン地点から四方八方に煙が広がります</ListItem>
          <ListItem><Highlight>螺旋</Highlight>: 螺旋状に煙が広がります</ListItem>
          <ListItem><Highlight>噴水</Highlight>: 上方向に煙が噴き出します</ListItem>
          <ListItem><Highlight>リング</Highlight>: 円形に煙が広がります</ListItem>
          <ListItem><Highlight>泡</Highlight>: お風呂のような泡が上昇し、弾けます</ListItem>
          <ListItem><Highlight>霧</Highlight>: もやもやとした霧状のおならが広がります</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>カラーブレンドモード</SectionTitle>
        <List>
          <ListItem><Highlight>グラデーション</Highlight>: メインカラーからサブカラーへのグラデーション</ListItem>
          <ListItem><Highlight>ランダム</Highlight>: メインカラーとサブカラーからランダムに色を選択</ListItem>
          <ListItem><Highlight>ストライプ</Highlight>: メインカラーとサブカラーの縞模様</ListItem>
          <ListItem><Highlight>交互に点滅</Highlight>: メインカラーとサブカラーを交互に表示</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>効果音ジャンル</SectionTitle>
        <List>
          <ListItem><Highlight>Small</Highlight>: 小さくて軽快な効果音</ListItem>
          <ListItem><Highlight>Medium</Highlight>: 中程度の大きさの効果音</ListItem>
          <ListItem><Highlight>Big</Highlight>: 大きな効果音</ListItem>
          <ListItem><Highlight>Dirty</Highlight>: 汚めの効果音</ListItem>
          <ListItem><Highlight>Sneaky</Highlight>: すかしっぺ</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>表示設定について <NewFeatureBadge>新機能</NewFeatureBadge></SectionTitle>
        <p>「表示」タブでは以下の出力設定を調整できます：</p>
        <List>
          <ListItem><Highlight>煙を表示</Highlight>: おならの煙エフェクトの表示/非表示を切り替えられます</ListItem>
          <ListItem><Highlight>音を鳴らす</Highlight>: 効果音の再生/停止を切り替えられます</ListItem>
          <ListItem><Highlight>デバイス振動</Highlight>: モバイルデバイスでの振動をオン/オフできます</ListItem>
          <ListItem><Highlight>画面振動</Highlight>: おなら時に画面が揺れるエフェクトをオン/オフできます <NewFeatureBadge>新機能</NewFeatureBadge></ListItem>
        </List>
        <p>各機能はそれぞれ独立して設定でき、振動の強さなども調整できます。</p>
      </Section>
      
      <Section>
        <SectionTitle>振動機能について <NewFeatureBadge>新機能</NewFeatureBadge></SectionTitle>
        <List>
          <ListItem><Highlight>デバイス振動</Highlight>: スマートフォンなどの対応端末でのみ動作します</ListItem>
          <ListItem><Highlight>画面振動</Highlight>: すべての端末で動作し、画面が揺れる効果を演出します</ListItem>
        </List>
        <p>振動の強さは以下から選択できます：</p>
        <List>
          <ListItem><Highlight>控えめ</Highlight>: ごく軽い振動</ListItem>
          <ListItem><Highlight>弱め</Highlight>: 軽い振動</ListItem>
          <ListItem><Highlight>普通</Highlight>: 標準的な強さの振動</ListItem>
          <ListItem><Highlight>強め</Highlight>: 強い振動</ListItem>
          <ListItem><Highlight>爆発的</Highlight>: 非常に強い振動</ListItem>
          <ListItem><Highlight>ランダム</Highlight>: 毎回ランダムな強さの振動</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>スポーン地点の管理</SectionTitle>
        <p>スポーン地点はおならが発生する場所です。📍ボタンをクリックしてスポーン地点の編集モードに入り、設定パネルの「スポーン」タブでスポーン地点を追加・削除できます。</p>
      </Section>
      
      <Section>
        <SectionTitle>自動おなら機能</SectionTitle>
        <p>「自動」タブで設定することで、一定間隔で自動的におならを発生させることができます。間隔や発生位置、使用する効果音を選択できます。</p>
      </Section>
      
      <Section>
        <SectionTitle>ヒントとコツ</SectionTitle>
        <List>
          <ListItem>複数のスポーン地点を設置すると、より複雑なエフェクトを作れます</ListItem>
          <ListItem>エフェクトオプションを組み合わせることで、より豊かな表現が可能です</ListItem>
          <ListItem>背景画像を設定することで、おならエフェクトの雰囲気が大きく変わります</ListItem>
          <ListItem>デバイス振動と画面振動を組み合わせると、より臨場感のある体験になります <NewFeatureBadge>新機能</NewFeatureBadge></ListItem>
          <ListItem>重い端末では、画面振動をオフにするとパフォーマンスが向上します</ListItem>
        </List>
      </Section>
      
      <Section>
        <SectionTitle>バージョン情報</SectionTitle>
        <p>おならじぇねれーたー v1.3.1</p>
        <p>バグ報告や要望などはXアカウント@Onara_generatorまで</p>
        <p>© 2025 とあるフェチクリエイター</p>
      </Section>
    </ReadmeContainer>
  );
}

export default ReadmeContent;