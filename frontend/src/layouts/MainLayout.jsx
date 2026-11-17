import { Outlet } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MainLayout = () => {

    // 마이페이지에서 프로필 정보 받기
    const [profileId, setProfileId] = useState(
        localStorage.getItem("profileId")
    );

    const [imageUrl, setImageUrl] = useState(
        localStorage.getItem("imageUrl") || ""
    );

    const handleProfileUpdate = (newProfileId, newImageUrl) => {
        setProfileId(newProfileId);
        setImageUrl(newImageUrl);
    }

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
