import { useState } from "react";
import styled from "styled-components";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import ProfileChoice from "../components/common/ProfileChoice.jsx";
import { saveLogin } from "../util/auth.jsx";
import { useNavigate } from "react-router-dom";

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
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const nav = useNavigate();

  const canSubmit = inputProfileId >= 1 && inputProfileId <= 5 && Boolean(nickname.trim());

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
          nickname: nickname.trim(),
        }),
      });

      if (response.status === 409) {
        setMessage("이미 사용 중인 닉네임입니다.");
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
    <Container>
      <Form onSubmit={onSubmit}>
        <h1>소셜 회원가입</h1>
        <label htmlFor="social-nickname">닉네임</label>
        <Input
          id="social-nickname"
          autoComplete="nickname"
          value={nickname}
          maxLength={20}
          required
          onChange={(event) => setNickname(event.target.value)}
        />
        <p>사용할 프로필을 선택해 주세요.</p>

        <ProfileChoice
          onSelect={setInputProfileId}
          selectedId={inputProfileId}
        />

        <Button
          type="submit"
          enabled={canSubmit && !isSubmitting && !completed}
        >
          {isSubmitting ? "가입 중..." : "가입 완료"}
        </Button>

        {message && <p role="status">{message}</p>}
      </Form>
    </Container>
  );
};

export default SocialSignUp;
