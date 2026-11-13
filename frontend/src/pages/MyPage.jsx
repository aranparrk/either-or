
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  box-sizing: border-box;
`;

// 상단 제목
const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #222;
`;

// 상단 소제목
const Description = styled.p`
  margin: 0 0 32px;
  font-size: 14px;
  color: #888;
`;

// 상단 메뉴 버튼 3개가 들어있는 영역
const Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

// 상단 메뉴 3개 버튼
const MenuBtn = styled.button`
  padding: 10px 40px;
  border: 1px solid ${({ $active }) => ($active ? "#36393b" : "#b5b5b5")};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#36393b" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#222")};
  font-size: 15px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 10px 0;
    font-size: 15px;
  }
`;

// 상단 메뉴에 따른 내용 영역
const Content = styled.div`
  min-height: 300px;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 12px;
`;


const MyPage = () => {

  const [activeTab, setActiveTab] = useState("info");

  return (
    <Container>
      <div>
        <Title>마이페이지</Title>
        <Description>당신의 공간</Description>
      </div>
      {/* 상단 메뉴 3개 */}
      <Menu>
        <MenuBtn
          $active={activeTab === "info"}
          onClick={() => setActiveTab("info")}
        >
          회원정보 변경
        </MenuBtn>

        <MenuBtn
          $active={activeTab === "poll"}
          onClick={() => setActiveTab("poll")}
        >
          내가 쓴 게시글
        </MenuBtn>

        <MenuBtn
          $active={activeTab === "comment"}
          onClick={() => setActiveTab("comment")}
        >
          내가 쓴 댓글
        </MenuBtn>
      </Menu>

      {/* 선택한 메뉴에 따라 내용 영역 변경 */}
      <Content>
        {activeTab === "info" && (
          <h3>회원정보 변경 화면입니다.</h3>
        )}

        {activeTab === "poll" && (
          <h3>내가 쓴 게시글 화면입니다.</h3>
        )}

        {activeTab === "comment" && (
          <h3>내가 쓴 댓글 화면입니다.</h3>
        )}
      </Content>
    </Container>
  );
};

export default MyPage;
