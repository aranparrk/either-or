import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;

const MainLayout = () => {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  );
};

export default MainLayout;
