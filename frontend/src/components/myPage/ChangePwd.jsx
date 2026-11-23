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
  display: flex;
  flex-direction: column;
  height: 90px;
  margin-bottom: 10px;
`;

// 입력칸 이름
const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
`;

const Message = styled.p`
  margin: 2px 0 0;
  height: 0px;
  line-height: 16px;
  text-align: right;
  font-size: 12px;
  color: ${({ $valid }) => ($valid ? "#2e9e4f" : "#e5484d")};
`;

// 비밀번호 변경
const ChangePwd = ({currentPwd, setCurrentPwd,
                       currentPwdValid, setCurrentPwdValid,
                       isCurrentPwd, setIsCurrentPwd,
                       newPwd, setNewPwd,
                       confirmPwd, setConfirmPwd,
                       isPwd,
                       isPwdSame,
                       isPwdConfirm},) => {
  return (
      <>

        <Title>비밀번호 변경</Title>

        <InputGroup>
          <InputLabel>기존 비밀번호</InputLabel>
          <Input
            type="password"
            value={currentPwd}
            onChange={(e) => {
                setCurrentPwd(e.target.value);
                if (!e.target.value) {
                    setCurrentPwdValid(null);
                    setIsCurrentPwd(false);
                } else {
                    setCurrentPwdValid(null);
                    setIsCurrentPwd(true);
                }
            }}
            placeholder="기존 비밀번호를 입력해 주세요."
          />
          <Message $valid={currentPwdValid}>
             {isCurrentPwd
                ? "비밀번호 확인 중..."
                : currentPwdValid === true
                    ? "기존 비밀번호가 일치합니다."
                    : currentPwdValid === false
                        ? "기존 비밀번호가 일치하지 않습니다."
                        : ""}
          </Message>
        </InputGroup>

        <InputGroup>
          <InputLabel>새 비밀번호</InputLabel>
          <Input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="새 비밀번호를 입력해 주세요."
          />
          <Message $valid={isPwd && !isPwdSame}>
            {newPwd &&
              (!isPwd
                ? "영문, 숫자, 특수문자 포함 8~20자로 입력하세요."
                : isPwdSame
                  ? "기존 비밀번호와 다른 비밀번호를 입력하세요."
                  : "사용 가능한 비밀번호입니다.")}
          </Message>
        </InputGroup>

        <InputGroup>
          <InputLabel>새 비밀번호 확인</InputLabel>
          <Input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="새 비밀번호를 다시 입력해 주세요."
          />
          <Message $valid={isPwdConfirm}>
            {confirmPwd &&
              (isPwdConfirm
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다.")}
          </Message>
        </InputGroup>

      </>
  );
};

export default ChangePwd;
