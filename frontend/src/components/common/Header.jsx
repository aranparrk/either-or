import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.header`
  width: 100%;
  height: 68px;
  background-color: #eaeaec;
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: #212121;
  text-decoration: none;
`;

const MenuLink = styled(Link)`
  font-size: 14px;
  color: #333;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RightMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderInner>
        <LeftMenu>
          <Logo to="/">⚖️ 양자택일</Logo>
          <MenuLink to="/">투표 목록</MenuLink>
        </LeftMenu>

        <RightMenu>
          <MenuLink to="/login">로그인</MenuLink>
          <span>|</span>
          <MenuLink to="/signup">회원가입</MenuLink>
        </RightMenu>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
