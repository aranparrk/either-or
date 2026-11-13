import { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { currentMemberId } from "../../api/currentMemberId";

const Item = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #eee;
`;

const Writer = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const CommentRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const Content = styled.p`
  flex: 1;
  min-width: 0;
  margin: 12px 0;
  font-size: 14px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #888;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  gap: 10px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  border: 0;
  background: transparent;
  padding: 4px 0;
  color: #777;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover:not(:disabled) {
    color: ${({ $danger }) => ($danger ? "#b42318" : "#242424")};
  }

  &:focus-visible {
    color: #242424;
    outline: 2px solid #777;
    outline-offset: 4px;
    border-radius: 2px;
  }

  &:disabled {
    color: #aaa;
    cursor: wait;
  }
`;

const EditInput = styled.textarea`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  min-height: 80px;
  margin: 8px 0;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font: inherit;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: 2px solid #777;
    outline-offset: 2px;
  }
`;

const ErrorText = styled.p`
  color: #b42318;
  font-size: 13px;
`;

const CommentItem = ({ comment, onDeleted, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isAuthor = currentMemberId() === String(comment.memberId);

  const handleSave = async () => {
    if (isSaving || isDeleting) return;
    const content = draft.trim();
    if (!content || content.length > 1000) {
      setErrorMessage("댓글은 1~1000자로 입력해주세요.");
      return;
    }
    setIsSaving(true);
    setErrorMessage("");
    try {
      const response = await AxiosApi.commentUpdate(comment.pollId, comment.commentId, content);
      onUpdated(response.data);
      setIsEditing(false);
    } catch (error) {
      const status = error.response?.status;
      setErrorMessage(status === 401 ? "다시 로그인해주세요." :
        status === 403 ? "작성자만 수정할 수 있습니다." :
        status === 404 ? "댓글을 찾을 수 없습니다. 페이지를 새로고침해주세요." :
        "댓글 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || isSaving || !window.confirm("댓글을 삭제할까요?")) return;

    setIsDeleting(true);
    setErrorMessage("");
    try {
      await AxiosApi.commentDelete(comment.pollId, comment.commentId);
      onDeleted(comment.commentId);
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        setErrorMessage("로그인이 필요합니다. 다시 로그인해주세요.");
      } else if (status === 403) {
        setErrorMessage("작성자만 삭제할 수 있습니다.");
      } else if (status === 404) {
        setErrorMessage("댓글을 찾을 수 없습니다. 페이지를 새로고침해주세요.");
      } else {
        setErrorMessage("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Item>
      <Writer>익명</Writer>
      <CommentRow>
        {isEditing ? (
          <EditInput
            aria-label="댓글 수정 내용"
            autoFocus
            value={draft}
            maxLength={1000}
            disabled={isSaving}
            onChange={(event) => setDraft(event.target.value)}
          />
        ) : <Content>{comment.content}</Content>}
        {isAuthor && (
          <Actions>
            {isEditing ? (
              <>
                <ActionButton type="button" disabled={isSaving} onClick={handleSave}>
                  {isSaving ? "저장 중..." : "저장"}
                </ActionButton>
                <ActionButton type="button" disabled={isSaving} onClick={() => {
                  setIsEditing(false);
                  setErrorMessage("");
                }}>취소</ActionButton>
              </>
            ) : (
              <>
                <ActionButton type="button" disabled={isDeleting} onClick={() => {
                  setDraft(comment.content);
                  setErrorMessage("");
                  setIsEditing(true);
                }}>수정</ActionButton>
                <span aria-hidden="true" style={{ color: "#ccc", alignSelf: "center" }}>·</span>
                <ActionButton $danger type="button" disabled={isDeleting} onClick={handleDelete}>
                  {isDeleting ? "삭제 중..." : "삭제"}
                </ActionButton>
              </>
            )}
          </Actions>
        )}
      </CommentRow>
      <DateText>{new Date(comment.regDate).toLocaleString("ko-KR")}</DateText>
      {errorMessage && <ErrorText role="alert">{errorMessage}</ErrorText>}
    </Item>
  );
};

export default CommentItem;
