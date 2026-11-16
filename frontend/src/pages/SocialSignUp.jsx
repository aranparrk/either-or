import { useState } from "react";
import styled from "styled-components";
import Button from "../components/common/Button.jsx";
import ProfileChoice from "../components/common/ProfileChoice.jsx";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 48px 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 36px;
  gap: 20px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background-color: white;
`;

const SocialSignUp = () => {
  const [inputProfileId, setInputProfileId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const isProfileId = inputProfileId >= 1 && inputProfileId <= 5;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isProfileId || isSubmitting || completed) return;

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
        }),
      });

      if (!response.ok) {
        throw new Error(`회원가입 실패 (${response.status})`);
      }

      // 서버에서 LoginResponseDto(JWT 포함)를 반환
      // 기존 일반 로그인과 동일한 토큰 저장 처리는 다음 단계에서 연결
      setCompleted(true);
      setMessage("회원가입 완료! 로그인 상태 연결은 아직 필요합니다.");
    } catch (error) {
      console.error("소셜 회원가입 실패:", error);
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <h1>소셜 회원가입</h1>
        <p>사용할 프로필을 선택해 주세요.</p>

        <ProfileChoice
          onSelect={setInputProfileId}
          selectedId={inputProfileId}
        />

        <Button
          type="submit"
          enabled={isProfileId && !isSubmitting && !completed}
        >
          {isSubmitting ? "가입 중..." : "가입 완료"}
        </Button>

        {message && <p role="status">{message}</p>}
      </Form>
    </Container>
  );
};

export default SocialSignUp;
