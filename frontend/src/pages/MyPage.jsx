import { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi.jsx";
import ProfileIconChange from "../components/common/ProfileIconChange.jsx";

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




// 비밀번호 입력 영역
const PasswordForm = styled.div`
  max-width: 450px;
  margin: 0 auto;
`;

// 입력창 제목
const FormTitle = styled.h3`
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  color: #333;
`;

// 입력 항목 영역
const InputGroup = styled.div`
  margin-bottom: 20px;
`;

// 입력 항목 이름
const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
`;

// 비밀번호 입력창
const PasswordInput = styled.input`
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #36393b;
  }
`;

// 비밀번호 변경 버튼
const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 8px;
  background-color: #36393b;
  color: white;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;




const MyPage = () => {

  const [activeTab, setActiveTab] = useState("info");

  // 비밀번호 변경
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [profileId, setProfileId] = useState(
  Number(localStorage.getItem("profileId")) || 1
  );

  const handleMemberUpdate = async () => {

      if (newPwd !== confirmPwd) {
          alert("새 비밀번호가 일치하지 않습니다.");
          return;
      }

      try {
          const response = await AxiosApi.memberUpdate(
              // undefined : 변경 내용이 없으면 보내지 않음
              currentPwd || undefined,
              newPwd || undefined,
              imageUrl || undefined,
              profileId || undefined
          );

          if (response.data === true) {
              alert("회원 정보가 변경되었습니다.");

              // 비밀번호 입력칸 초기화
              setCurrentPwd("");
              setNewPwd("")
              setConfirmPwd("")
          }

      } catch (error) {
          console.error("비밀번호 변경 오류:", error);
          alert(error.response?.data?.message || "비밀번호 변경을 실패했습니다.");
      }
  };


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
          <>
            <ProfileIconChange
              profileId={profileId}
              imageUrl={imageUrl}
              onProfileSelect={(id) => {
                setProfileId(id);
                setImageUrl("");
              }}
              onImageUploaded={(url) => {
                setImageUrl(url);
                setProfileId(null);
              }}
            />
            <PasswordForm>

            <FormTitle>비밀번호 변경</FormTitle>

            <InputGroup>
              <InputLabel>기존 비밀번호</InputLabel>
              <PasswordInput
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="기존 비밀번호를 입력해 주세요."
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>새 비밀번호</InputLabel>
              <PasswordInput
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="새 비밀번호를 입력해 주세요."
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>새 비밀번호 확인</InputLabel>
              <PasswordInput
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="새 비밀번호를 다시 입력해 주세요."
              />
            </InputGroup>

            <SubmitBtn
              onClick={handleMemberUpdate}
              disabled={
                (newPwd && newPwd !== confirmPwd) ||
                (newPwd && !currentPwd)
              }
            >
              변경하기
            </SubmitBtn>

          </PasswordForm>
          </>
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
