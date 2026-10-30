import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Header = styled.header`
  height: 80px;
  background-color: rgb(234, 234, 236);
`;

const Main = styled.main`
  flex: 1;
  background-color: white;
`;

const Footer = styled.footer`
  height: 40px;
  border-top: 1px solid rgb(234, 234, 236);
  background-color: white;
`;

const AuthLayout = () => {
  const { pahname } = useLocation;

  const pageTitle = pahname === "/login" ? "로그인" : "회원가입";

  return (
    <Container>
      <Header>
        <h1>양자택일</h1>
        <h3>{pageTitle}</h3>
      </Header>
      <Main>
        <Outlet />
      </Main>
      <Footer>
        <p>{pageTitle}</p>
      </Footer>
    </Container>
  );
};

export default AuthLayout;
