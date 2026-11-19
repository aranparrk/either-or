import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TravelAuthLayout, { AuthDivider } from "../components/common/TravelAuthLayout.jsx";
import Button from "../components/common/Button";
import FormFeedback from "../components/common/FormFeedback.jsx";
import Input from "../components/common/Input";
import AxiosApi from "../api/AxiosApi";
import { saveLogin } from "../util/auth";
import GoogleButton from "../components/common/GoogleButton.jsx";
import KakaoButton from "../components/common/KakaoButton.jsx";

const Form2 = styled.form`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const nav = useNavigate();

  const isValid = inputEmail.trim() !== "" && inputPwd !== "";

  const kakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setLoginError("");

    try {
      const response = await AxiosApi.memberLogin(inputEmail.trim(), inputPwd);

      const data = response.data;

      if (!data?.accessToken) {
        setLoginError("로그인하지 못했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      saveLogin(data);

      nav("/", { replace: true });
    } catch (error) {
      if (error.response?.status === 401) {
        setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setLoginError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TravelAuthLayout>
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

        <FormFeedback>{loginError}</FormFeedback>
        <Button type="submit" enabled={isValid && !isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
        <AuthDivider />
        <KakaoButton disabled={isSubmitting} onClick={kakaoLogin}>
          카카오로 로그인
        </KakaoButton>
        <GoogleButton disabled={isSubmitting} onClick={googleLogin}>
          구글로 로그인
        </GoogleButton>
        <SignUpLink to="/signup">회원가입으로 이동</SignUpLink>
      </Form2>
    </TravelAuthLayout>
  );
};

export default Login;
