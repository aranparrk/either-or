import styled from "styled-components";
import Input from "../common/Input.jsx";

// 비밀번호 변경 제목
const Title = styled.h3`
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  color: #333;
`;

// 입력칸 영역
const InputGroup = styled.div`
  margin-bottom: 20px;
`;

// 입력칸 이름
const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
`;

// 비밀번호 변경
const ChangePwd = ({currentPwd, setCurrentPwd,
                       newPwd, setNewPwd,
                       confirmPwd, setConfirmPwd}) => {
  return (
      <>

        <Title>비밀번호 변경</Title>

        <InputGroup>
          <InputLabel>기존 비밀번호</InputLabel>
          <Input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder="기존 비밀번호를 입력해 주세요."
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>새 비밀번호</InputLabel>
          <Input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="새 비밀번호를 입력해 주세요."
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>새 비밀번호 확인</InputLabel>
          <Input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="새 비밀번호를 다시 입력해 주세요."
          />
        </InputGroup>

      </>
  );
};

export default ChangePwd;
