import { useLocation } from "react-router-dom";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  height: 40px;
  border-top: 1px solid #d1d5db;
  background-color: white;
`;

const FooterInner = styled.div`
  max-width: 1500px;
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(24px, 3vw, 44px);
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const FooterText = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const Footer = () => {
  const { pathname } = useLocation();

  const pageTitles = {
    "/": "투표 목록",
    "/login": "로그인",
    "/signup": "회원가입",
    "/votes/new": "투표 등록",
  };

  const pageTitle =
    pageTitles[pathname] ?? (pathname.startsWith("/votes/") ? "투표 상세" : "");

  return (
    <FooterContainer>
      <FooterInner>
        <FooterText>양자택일 · 여행지 투표</FooterText>
        <FooterText>{pageTitle}</FooterText>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;
