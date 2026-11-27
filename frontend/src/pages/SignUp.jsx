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

  &[aria-busy="true"] {
    color: #666;
  }
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

function useSignupField(checkExists, validate) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle");
  const lookupValue = value.trim();
  const valid = validate(lookupValue);

  function changeValue(nextValue) {
    if (nextValue.trim() !== lookupValue) setStatus("checking");
    setValue(nextValue);
  }

  useEffect(() => {
    if (!valid) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { data } = await checkExists(lookupValue, controller.signal);
        if (!controller.signal.aborted) setStatus(data ? "duplicate" : "available");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [checkExists, lookupValue, valid]);

  return [value, changeValue, valid ? status : "idle", setStatus];
}

function availabilityMessage(status, available, duplicate) {
  switch (status) {
    case "checking": return "중복 확인 중...";
    case "available": return available;
    case "duplicate": return duplicate;
    case "error": return "중복 확인 중 오류가 발생했습니다.";
    default: return "";
  }
}

const SignUp = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [inputEmail, setInputEmail, emailStatus] = useSignupField(
    AxiosApi.memberExist, (email) => EMAIL_REGEX.test(email),
  );
  const [nickname, setNickname, nicknameStatus, setNicknameStatus] = useSignupField(
    AxiosApi.nicknameExists, (value) => value.length > 0 && value.length <= 20,
  );
  const [inputPwd, setInputPwd] = useState("");
  const [inputProfileId, setInputProfileId] = useState(0);
  const [inputPwdConfirm, setInputPwdConfirm] = useState("");
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

  const isEmailOk = emailStatus === "available";
  const isNicknameOk = nicknameStatus === "available";
  const isAllValid = isEmailOk && isNicknameOk && isPwd && isPwdConfirm && isProfileId;
  const emailMessage = inputEmail && !isEmail ? "이메일 형식이 올바르지 않습니다."
    : availabilityMessage(emailStatus, "사용 가능한 이메일입니다.", "이미 가입된 이메일입니다.");
  const nicknameMessage = nickname && !nickname.trim() ? "닉네임을 입력해주세요."
    : availabilityMessage(nicknameStatus, "사용 가능한 닉네임입니다.", "이미 사용 중인 닉네임입니다.");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!showEmailForm || !isAllValid || isSubmitting) return;

    setIsSubmitting(true);
    setSignupError("");
    try {
      const response = await AxiosApi.memberSignup(inputEmail, inputPwd, inputProfileId, nickname.trim());
      if (response.data === true) {
        nav("/login", { replace: true });
      } else {
        setSignupError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setNicknameStatus("duplicate");
      } else {
        setSignupError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
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

            <Label htmlFor="signup-email">이메일</Label>
            <Field>
              <Input
                id="signup-email"
                aria-describedby="signup-email-message"
                type="email"
                value={inputEmail}
                placeholder="이메일을 입력해주세요"
                onChange={(e) => setInputEmail(e.target.value.trim())}
              />
              <Message
                id="signup-email-message"
                aria-live="polite"
                aria-busy={emailStatus === "checking"}
                $valid={isEmailOk}
              >
                {emailMessage}
              </Message>
            </Field>

            <Label htmlFor="signup-nickname">닉네임</Label>
            <Field>
              <Input
                id="signup-nickname"
                autoComplete="nickname"
                aria-describedby="signup-nickname-message"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                maxLength={20}
                required
                disabled={isSubmitting}
                onChange={(event) => setNickname(event.target.value)}
              />
              <Message
                id="signup-nickname-message"
                aria-live="polite"
                aria-busy={nicknameStatus === "checking"}
                $valid={isNicknameOk}
              >
                {nicknameMessage}
              </Message>
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
              카카오로 회원가입
            </KakaoButton>

            <GoogleButton onClick={googleSignUp}>
              구글로 회원가입
            </GoogleButton>

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
