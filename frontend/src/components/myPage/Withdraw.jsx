import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import styled from "styled-components";
import FormFeedback from "../common/FormFeedback.jsx";

const ActionButton = styled.button`
  display: block;
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #777;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #242424;
  }
`;

const ConfirmDialog = styled.dialog`
  box-sizing: border-box;
  width: min(420px, calc(100% - 32px));
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  color: #242424;
  background: #fff;
  box-shadow: 0 16px 48px rgba(0, 0, 0, .16);

  &::backdrop {
    background: rgba(0, 0, 0, .4);
  }

  h2 {
    margin: 0 0 10px;
    font-size: 20px;
  }

  h2 + p {
    margin: 0;
    color: #555;
    font-size: 14px;
    line-height: 1.6;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;

  button {
    padding: 9px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    color: #242424;
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }

  button:last-child {
    border-color: #a32b2b;
    background: #a32b2b;
    color: #fff;
  }

  button:disabled {
    opacity: .6;
    cursor: wait;
  }
`;

export default function Withdraw() {
  const dialogRef = useRef(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    setError("");
    setIsWithdrawing(true);

    try {
      await AxiosApi.memberWithdraw();

      for (const key of ["accessToken", "refreshToken", "isLogin", "email", "profileId", "imageUrl"]) {
        localStorage.removeItem(key);
      }
      window.dispatchEvent(new Event("authChanged"));
      dialogRef.current?.close();
      nav("/login", { replace: true });
    } catch (error) {
      setError(error.response?.status === 401
        ? "로그인 시간이 만료됐어요. 다시 로그인해주세요."
        : "회원탈퇴를 처리하지 못했어요. 다시 시도해주세요.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <>
      <ActionButton type="button" onClick={() => {
        setError("");
        dialogRef.current?.showModal();
      }}>
        회원탈퇴
      </ActionButton>
      <ConfirmDialog
        ref={dialogRef}
        aria-labelledby="withdraw-title"
        aria-describedby="withdraw-description"
        onCancel={(event) => {
          if (isWithdrawing) event.preventDefault();
        }}
      >
        <h2 id="withdraw-title">회원 탈퇴</h2>
        <p id="withdraw-description">계정과 작성한 투표·댓글이 삭제되며 복구할 수 없어요.</p>
        <FormFeedback>{error}</FormFeedback>
        <Actions>
          <button type="button" autoFocus disabled={isWithdrawing} onClick={() => dialogRef.current?.close()}>
            취소
          </button>
          <button type="button" disabled={isWithdrawing} onClick={handleWithdraw}>
            {isWithdrawing ? "탈퇴 처리 중…" : "탈퇴하기"}
          </button>
        </Actions>
      </ConfirmDialog>
    </>
  );
}
