import { useState } from "react";
import TravelAuthLayout from "../components/common/TravelAuthLayout.jsx";
import Button from "../components/common/Button.jsx";
import FormFeedback from "../components/common/FormFeedback.jsx";
import NicknameField from "../components/signup/NicknameField.jsx";
import { SignupForm, Title, Label } from "../components/signup/signupStyles.js";
import { useNicknameField } from "../hooks/useSignupField.js";
import ProfileChoice from "../components/common/ProfileChoice.jsx";
import { saveLogin } from "../util/auth.jsx";
import { useNavigate } from "react-router-dom";

const SocialSignUp = () => {
  const [inputProfileId, setInputProfileId] = useState(0);
  const nickname = useNicknameField();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const nav = useNavigate();

  const canSubmit = inputProfileId >= 1 && inputProfileId <= 5 && nickname.status === "available";

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit || isSubmitting || completed) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      // 1. 현재 세션의 CSRF 토큰 조회
      const csrfRes = await fetch("/api/auth/social/csrf", {
        credentials: "include",
      });

      if (!csrfRes.ok) {
        throw new Error("CSRF 토큰 조회 실패");
      }

      const csrf = await csrfRes.json();

      // 2. 선택한 프로필 번호로 소셜 회원가입
      const response = await fetch("/api/auth/social/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({
          profileId: inputProfileId,
          nickname: nickname.value.trim(),
        }),
      });

      if (response.status === 409) {
        nickname.markDuplicate();
        return;
      }

      if (!response.ok) {
        throw new Error(`회원가입 실패 (${response.status})`);
      }

      // fetch 응답을 JSON으로 변환
      const data = await response.json();

      // JWT 및 회원 정보 저장
      saveLogin(data);

      setCompleted(true);

      // 메인 페이지로 이동
      nav("/", { replace: true });
    } catch (error) {
      console.error("소셜 회원가입 실패:", error);
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TravelAuthLayout>
      <SignupForm onSubmit={onSubmit}>
        <Title>소셜 회원가입</Title>
        <NicknameField id="social-nickname" field={nickname} disabled={isSubmitting || completed} />
        <Label as="p">프로필</Label>
        <ProfileChoice
          onSelect={setInputProfileId}
          selectedId={inputProfileId}
        />

        <FormFeedback>{message}</FormFeedback>
        <Button
          type="submit"
          enabled={canSubmit && !isSubmitting && !completed}
        >
          {isSubmitting ? "가입 중…" : "가입 완료"}
        </Button>
      </SignupForm>
    </TravelAuthLayout>
  );
};

export default SocialSignUp;
