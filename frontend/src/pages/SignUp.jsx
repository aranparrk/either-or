import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import TravelAuthLayout, { AuthDivider } from "../components/common/TravelAuthLayout.jsx";
import AxiosApi from "../api/AxiosApi.jsx";
import Button from "../components/common/Button.jsx";
import FormFeedback from "../components/common/FormFeedback.jsx";
import Input from "../components/common/Input.jsx";
import ProfileChoice from "../components/common/ProfileChoice.jsx";
import GoogleButton from "../components/common/GoogleButton.jsx";
import KakaoButton from "../components/common/KakaoButton.jsx";

// 이메일 형식 검증
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 비밀번호: 8~20자, 영문 + 숫자 + 특수문자
const PWD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

const Form2 = styled.form`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;

  > label:not(:first-of-type) {
    margin-top: 12px;
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

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Message = styled.p`
  margin: 0;
  min-height: 18px;
  text-align: right;
  font-size: 12px;
  color: ${({ $valid }) => ($valid ? "#2e9e4f" : "#e5484d")};
`;

const BackButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  color: #666;
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: #252525;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #76879b;
    outline-offset: 2px;
  }
`;

const LoginLink = styled(Link)`
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: #666;
  text-underline-offset: 3px;
`;

const SignUp = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [inputProfileId, setInputProfileId] = useState(0);
  const [inputPwdConfirm, setInputPwdConfirm] = useState("");
  const [emailStatus, setEmailStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState("");

  const nav = useNavigate();

  const isEmail = EMAIL_REGEX.test(inputEmail);
  const isPwd = PWD_REGEX.test(inputPwd);
  const isProfileId = inputProfileId >= 1 && inputProfileId <= 5;
  const isPwdConfirm =
    inputPwdConfirm.length > 0 && inputPwd === inputPwdConfirm;

  const selectProfile = (profileId) => {
    setInputProfileId(profileId);
  };

  useEffect(() => {
    let ignore = false;

    if (!isEmail) {
      return () => {
        ignore = true;
      };
    }

    const timer = setTimeout(async () => {
      try {
        if (ignore) return;
        setEmailStatus("checking");

        const res = await AxiosApi.memberExist(inputEmail);
        if (ignore) return;

        setEmailStatus(res.data === true ? "duplicate" : "available");
      } catch (error) {
        console.error("이메일 중복 확인 실패 ", error);
        if (!ignore) setEmailStatus("error");
      }
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [inputEmail, isEmail]);

  const isEmailOk = isEmail && emailStatus === "available";
  const isAllValid = isEmailOk && isPwd && isPwdConfirm && isProfileId;

  const getEmailMessage = () => {
    if (!inputEmail) return "";
    if (!isEmail) return "이메일 형식이 올바르지 않습니다.";

    switch (emailStatus) {
      case "checking":
        return "중복 확인 중...";
      case "available":
        return "사용 가능한 이메일입니다.";
      case "duplicate":
        return "이미 가입된 이메일입니다.";
      case "error":
        return "중복 확인 중 오류가 발생했습니다.";
      default:
        return "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!showEmailForm || !isAllValid || isSubmitting) return;

    setIsSubmitting(true);
    setSignupError("");
    try {
      const response = await AxiosApi.memberSignup(inputEmail, inputPwd, inputProfileId);
      if (response.data === true) {
        nav("/login", { replace: true });
      } else {
        setSignupError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      setSignupError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const kakaoSignUp = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  const googleSignUp = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <TravelAuthLayout>
      <Form2 onSubmit={onSubmit}>
        <Title>{showEmailForm ? "이메일로 가입하기" : "회원가입"}</Title>

        {showEmailForm ? (
          <>

            <Label>이메일</Label>
            <Field>
              <Input
                type="email"
                value={inputEmail}
                placeholder="이메일을 입력해주세요"
                onChange={(e) => setInputEmail(e.target.value.trim())}
              />
              <Message $valid={isEmailOk}>{getEmailMessage()}</Message>
            </Field>

            <Label>비밀번호</Label>
            <Field>
              <Input
                type="password"
                value={inputPwd}
                placeholder="비밀번호를 입력해주세요"
                onChange={(e) => setInputPwd(e.target.value)}
              />
              <Message $valid={isPwd}>
                {inputPwd &&
                  (isPwd
                    ? "사용 가능한 비밀번호입니다."
                    : "영문, 숫자, 특수문자 포함 8~20자로 입력하세요.")}
              </Message>
            </Field>

            <Label>비밀번호 확인</Label>
            <Field>
              <Input
                type="password"
                value={inputPwdConfirm}
                placeholder="비밀번호를 한 번 더 입력해주세요"
                onChange={(e) => setInputPwdConfirm(e.target.value)}
              />
              <Message $valid={isPwdConfirm}>
                {inputPwdConfirm &&
                  (isPwdConfirm
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다.")}
              </Message>
            </Field>

            <Label>프로필</Label>
            <ProfileChoice onSelect={selectProfile} selectedId={inputProfileId} />

            <FormFeedback>{signupError}</FormFeedback>
            <Button type="submit" enabled={isAllValid && !isSubmitting}>
              {isSubmitting ? "가입 중…" : "가입하기"}
            </Button>

            <BackButton type="button" disabled={isSubmitting} onClick={() => {
              setSignupError("");
              setShowEmailForm(false);
            }}>
              ← 가입 방식 다시 선택
            </BackButton>
          </>
        ) : (
          <>
            <KakaoButton onClick={kakaoSignUp}>
              카카오로 가입하기
            </KakaoButton>

            <GoogleButton onClick={googleSignUp} />

            <AuthDivider />

            <Button type="button" enabled onClick={() => setShowEmailForm(true)}>
              이메일로 가입하기
            </Button>
          </>
        )}

        <LoginLink to="/login">이미 계정이 있나요? 로그인</LoginLink>
      </Form2>
    </TravelAuthLayout>
  );
};

export default SignUp;
