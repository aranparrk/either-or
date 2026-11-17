import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AxiosApi from "../api/AxiosApi";
import { saveLogin } from "../util/auth";

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

const KakaoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  padding: 0 16px;
  border: none;
  border-radius: 9px;
  background-color: #fee500;
  color: #191919;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;

  &:hover:not(:disabled) {
    background-color: #fada00;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid #191919;
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Login = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nav = useNavigate();

  const isValid = inputEmail.trim() !== "" && inputPwd !== "";

  const kakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await AxiosApi.memberLogin(inputEmail.trim(), inputPwd);

      const data = response.data;

      if (!data?.accessToken) {
        alert("로그인 응답에 토큰이 없습니다.");
        return;
      }

      saveLogin(data);

      nav("/", { replace: true });
    } catch (error) {
      console.error("로그인 오류", error);

      if (error.response?.status === 401) {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
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

        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          value={inputEmail}
          placeholder="이메일을 입력해주세요"
          onChange={(e) => setInputEmail(e.target.value)}
        />

        <Label htmlFor="pwd">비밀번호</Label>
        <Input
          id="pwd"
          type="password"
          autoComplete="current-password"
          value={inputPwd}
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => setInputPwd(e.target.value)}
        />

        <Button type="submit" enabled={isValid && !isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
        <KakaoButton type="button" disabled={isSubmitting} onClick={kakaoLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3C6.477 3 2 6.582 2 11c0 2.85 1.86 5.352 4.66 6.766L5.5 21l4.06-2.435c.79.15 1.607.235 2.44.235 5.523 0 10-3.582 10-8S17.523 3 12 3Z"
            />
          </svg>
          카카오로 로그인
        </KakaoButton>
        <SignUpLink to="/signup">회원가입으로 이동</SignUpLink>
      </Form2>
    </Container>
  );
};

export default Login;
