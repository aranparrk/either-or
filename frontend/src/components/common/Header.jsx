import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProfileIcon from "./ProfileIcon.jsx";
import { useEffect } from "react";

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

  const location = useLocation();

  const isLogin =
    localStorage.getItem("isLogin") === "TRUE" &&
    Boolean(localStorage.getItem("accessToken"));

  const onLogout = () => {
    // JWT와 회원 정보 삭제
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("email");
    localStorage.removeItem("profileId");

    nav("/login", { replace: true });
  };

  useEffect(() => {
    let timerId;

    const clearLogin = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("email");
      localStorage.removeItem("profileId");

      window.location.replace("/login");
    };

    const checkExpiration = () => {
      clearTimeout(timerId);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        return;
      }

      try {
        // JWT 가운데 부분에서 만료 시각 읽기
        const base64 = token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

        const payload = JSON.parse(atob(padded));

        if (typeof payload.exp !== "number") {
          clearLogin();
          return;
        }

        // JWT의 exp는 초 단위이므로 밀리초로 변환
        const remainingMs = payload.exp * 1000 - Date.now();

        if (remainingMs <= 0) {
          clearLogin();
          return;
        }

        timerId = window.setTimeout(
          checkExpiration,
          Math.min(remainingMs, 2147483647)
        );
      } catch {
        // 토큰 형식이 잘못된 경우에도 로그인 정보 삭제
        clearLogin();
      }
    };

    checkExpiration();

    // 다른 탭이나 절전 상태에서 돌아왔을 때도 다시 확인
    window.addEventListener("focus", checkExpiration);
    document.addEventListener("visibilitychange", checkExpiration);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("focus", checkExpiration);
      document.removeEventListener("visibilitychange", checkExpiration);
    };
  }, [location.key]);

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
