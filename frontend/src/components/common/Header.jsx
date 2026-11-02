import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import ProfileIcon from "./ProfileIcon.jsx";

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

const LogoutButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  const nav = useNavigate();

  useLocation(); // 페이지 이동 시 Header 다시 렌더링

  const isLogin = localStorage.getItem("isLogin") === "TRUE";

  const onLogout = async () => {
    try {
      await AxiosApi.memberLogout();

      localStorage.removeItem("isLogin");
      localStorage.removeItem("email");
      localStorage.removeItem("profileId");

      nav("/login", { replace: true });
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <HeaderContainer>
      <HeaderInner>
        <LeftMenu>
          <Logo to="/">⚖️ 양자택일</Logo>
          <MenuLink to="/">투표 목록</MenuLink>
        </LeftMenu>

        <RightMenu>
          {isLogin ? (
            <>
              <ProfileIcon/>
              <span>|</span>
              <LogoutButton type="button" onClick={onLogout}>
                로그아웃
              </LogoutButton>
            </>
          ) : (
            <>
              <MenuLink to="/login">로그인</MenuLink>
              <span>|</span>
              <MenuLink to="/signup">회원가입</MenuLink>
            </>
          )}
        </RightMenu>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
