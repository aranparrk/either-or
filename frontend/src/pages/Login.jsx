import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AxiosApi from "../api/AxiosApi";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 56px;
  padding: 48px 24px;

  @media (max-width: 820px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const Form1 = styled.div`
  width: 100%;
  max-width: 360px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > p {
    margin-bottom: 20px;
  }
`;

const Form2 = styled.form`
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 36px;
  gap: 8px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background-color: white;

  > label:not(:first-of-type) {
    margin-top: 12px;
  }

  input {
    width: 100%;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    margin-top: 14px;
  }
`;

const ABbox = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  margin-top: 4px;
`;

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  color: #252525;
`;

const Label = styled.label`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
`;

const Caption1 = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #666;
`;

const Caption2 = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 0;
  height: 120px;
  box-sizing: border-box;
  padding: 16px;
  background-color: rgb(234, 234, 234);
  border-radius: 10px;
  text-align: center;

  h1 {
    margin: 0 0 10px;
    font-size: 30px;
    color: #666;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #666;
  }
`;

const SignUpLink = styled(Link)`
  display: block;
  width: 100%;
  margin-top: 8px;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  color: #555;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");

  const nav = useNavigate();

  // 둘 다 입력돼야 버튼 활성화
  const isValid = inputEmail.trim() !== "" && inputPwd !== "";

  // form의 onSubmit으로 처리하면 Enter 키로도 로그인 가능
  const onSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    try {
      const response = await AxiosApi.memberLogin(inputEmail, inputPwd);

      if (response.data) {
        localStorage.setItem("isLogin", "TRUE");
        localStorage.setItem("email", inputEmail);
        localStorage.setItem("profileId", response.data.profileId);
        nav("/", { replace: true }); // 뒤로가기로 로그인 화면에 다시 오지 않도록
      } else {
        alert("이메일 또는 비밀번호가 틀립니다.");
      }
    } catch (errer) {
      console.error("로그인 오류", errer);
      alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Form1>
        <Caption1>찬반 토론의 시작!</Caption1>

        <Title>
          당신의 생각은
          <br />
          어느 쪽인가요?
        </Title>

        <Caption1>
          두 가지 선택 사이, 나의 의견을 남겨보세요.
          <br />
          투표에 참여하고 대중의 선택을 볼 수 있습니다.
        </Caption1>

        <ABbox>
          <Caption2>
            <h1>A</h1>
            <p>당신의 선택</p>
          </Caption2>
          <Caption2>
            <h1>B</h1>
            <p>당신의 선택</p>
          </Caption2>
        </ABbox>
      </Form1>

      <Form2 onSubmit={onSubmit}>
        <Title>로그인</Title>
        <Label>이메일</Label>
        <Input
          type="email"
          value={inputEmail}
          placeholder="이메일을 입력해주세요"
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={inputPwd}
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => setInputPwd(e.target.value)}
        />
        <Button type="submit" enabled={isValid}>
          로그인
        </Button>
        <SignUpLink to="/signup">회원가입으로 이동</SignUpLink>
      </Form2>
    </Container>
  );
};

export default Login;
