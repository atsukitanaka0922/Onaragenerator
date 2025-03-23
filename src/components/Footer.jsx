import styled from 'styled-components';

const FooterContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  z-index: 40;
`;

function Footer() {
  return (
    <FooterContainer>
      <div>マルチカラー煙エフェクトアプリ v1.0.0</div>
      <div>© 2023 開発チーム</div>
    </FooterContainer>
  );
}

export default Footer;