import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProfileIcon from "./ProfileIcon.jsx";
import AxiosApi from "../../api/AxiosApi.jsx";

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

  // 페이지 이동 시 변경된 로그인 정보를 반영
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const checkLogin = () => {
      const login =
        localStorage.getItem("isLogin") === "TRUE" &&
        Boolean(localStorage.getItem("accessToken"));

      setIsLogin(login);
    };

    // 이벤트 감지 시작
    window.addEventListener("authChanged", checkLogin);

    // 처음 헤더가 나타났을 때 로그인 상태 확인
    checkLogin();

    // 헤더가 사라질 때 이벤트 감지 정리
    return () => {
      window.removeEventListener("authChanged", checkLogin);
    };
  }, []);

  const onLogout = async () => {
    try {
      await AxiosApi.memberLogout();
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
    } finally {
      // 로그아웃시 JWT와 회원 정보 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("email");
      localStorage.removeItem("profileId");

      // 로그아웃 상태 변경 알림
      window.dispatchEvent(new Event("authChanged"))

      nav("/login", { replace: true });
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
              <ProfileIcon />
              <MenuLink to="/mypage">마이페이지</MenuLink>
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
