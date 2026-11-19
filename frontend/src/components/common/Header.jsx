import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProfileIcon from "./ProfileIcon.jsx";
import AxiosApi from "../../api/AxiosApi.jsx";

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #dce7e1;
`;

const HeaderInner = styled.div`
  max-width: 1500px;
  min-height: 68px;
  margin: 0 auto;
  padding: 0 clamp(24px, 3vw, 44px);

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, min(36%, 400px)) minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    flex-wrap: wrap;
  }
`;

const Brand = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: clamp(16px, 4vw, 20px);
  font-weight: 700;
  color: #174c42;
  text-decoration: none;
  white-space: nowrap;

  img {
    width: 26px;
    height: 26px;
  }
`;

const MenuLink = styled(Link)`
  font-size: 14px;
  color: #333;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const Tagline = styled.span`
  border-left: 1px solid #a1afa9;
  padding-left: 14px;
  color: #34423d;
  font-size: 13px;
  white-space: nowrap;

  @media (768px < width <= 1120px) {
    display: none;
  }

  @media (max-width: 560px) {
    border-left: 0;
    padding-left: 0;
    font-size: 11px;
    white-space: normal;
    word-break: keep-all;
  }
`;

const HeaderSearch = styled.form`
  display: flex;
  flex: 1;
  min-width: 0;
  max-width: 400px;
  gap: 6px;

  @media (max-width: 768px) {
    order: 1;
    flex: 1 0 100%;
    max-width: none;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  width: 0;
  min-width: 0;
  padding: 9px 12px;
  border: 1px solid #cdded5;
  border-radius: 8px;
  color: #173c35;
  font: inherit;
  font-size: 14px;
`;

const SearchButton = styled.button`
  padding: 8px 12px;
  border: 0;
  border-radius: 8px;
  background: #205c50;
  color: #fff;
  font: inherit;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #174c42;
  }
`;

const RightMenu = styled.nav`
  display: flex;
  justify-self: end;
  max-width: 100%;
  min-width: 0;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(8px, 2vw, 16px);
`;

const Greeting = styled.span`
  display: flex;
  min-width: 0;
  max-width: 120px;
  color: #174c42;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;

const GreetingName = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  const nav = useNavigate();
  const location = useLocation();
  const searchQuery = location.pathname === "/"
    ? new URLSearchParams(location.search).get("q") ?? ""
    : "";

  const onSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q").trim();
    nav(query ? { pathname: "/", search: new URLSearchParams({ q: query }).toString() } : "/");
  };

  // 페이지 이동 시 변경된 로그인 정보를 반영
  const [isLogin, setIsLogin] = useState(false);
  const [nickname, setNickname] = useState("");

  const [profileId, setProfileId] = useState(
      localStorage.getItem("profileId")
  );

  const [imageUrl, setImageUrl] = useState(
      localStorage.getItem("imageUrl") || ""
  );


  useEffect(() => {
    let nicknameRequest;

    // 로그인 상태 확인
    const checkLogin = () => {
      nicknameRequest?.abort();
      const login =
        localStorage.getItem("isLogin") === "TRUE" &&
        Boolean(localStorage.getItem("accessToken"));

      setIsLogin(login);

      setProfileId(localStorage.getItem("profileId"));
      setImageUrl(localStorage.getItem("imageUrl") || "");

      if (!login) {
        setNickname("");
        return;
      }

      const controller = new AbortController();
      nicknameRequest = controller;
      AxiosApi.memberNickname(controller.signal)
        .then(({ data }) => {
          if (!controller.signal.aborted) setNickname(data.nickname ?? "");
        })
        .catch(() => {
          if (!controller.signal.aborted) setNickname("");
        });
    };

    // 이벤트 감지 시작
    window.addEventListener("authChanged", checkLogin);

    // 처음 헤더가 나타났을 때 로그인 상태 확인
    checkLogin();

    // 헤더가 사라질 때 이벤트 감지 정리
    return () => {
      window.removeEventListener("authChanged", checkLogin);
      nicknameRequest?.abort();
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
      localStorage.removeItem("imageUrl");

      // 로그아웃 상태 변경 알림
      window.dispatchEvent(new Event("authChanged"))

      nav("/login", { replace: true });
    }
  };

  return (
    <HeaderContainer>
      <HeaderInner>
        <Brand>
          <Logo to="/">
            <img src="/favicon.svg" alt="" />
            양자택일
          </Logo>
          <Tagline>여행, 고민된다면? 선택은 양자택일!</Tagline>
        </Brand>

        <HeaderSearch role="search" onSubmit={onSearch}>
          <SearchInput
            key={searchQuery}
            defaultValue={searchQuery}
            name="q"
            type="search"
            aria-label="투표 제목 또는 여행지 검색"
            placeholder="투표 제목 또는 여행지 검색"
          />
          <SearchButton type="submit">검색</SearchButton>
        </HeaderSearch>

        <RightMenu aria-label="계정">
          {isLogin ? (
            <>
              <ProfileIcon
                profileId={profileId}
                imageUrl={imageUrl}
              />
              {nickname && (
                <Greeting title={`${nickname}님`}>
                  <GreetingName>{nickname}</GreetingName>님
                </Greeting>
              )}
              <MenuLink to="/mypage">마이페이지</MenuLink>
              <LogoutButton type="button" onClick={onLogout}>
                로그아웃
              </LogoutButton>
            </>
          ) : (
            <>
              <MenuLink to="/login">로그인</MenuLink>
              <MenuLink to="/signup">회원가입</MenuLink>
            </>
          )}
        </RightMenu>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
