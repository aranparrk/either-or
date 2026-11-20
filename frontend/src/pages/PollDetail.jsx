import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AxiosApi from "../api/AxiosApi";
import { currentMemberId } from "../api/currentMemberId";
import styled from "styled-components";
import CommentItem from "../components/comment/CommentItem";
import Button from "../components/common/Button";
import FormFeedback from "../components/common/FormFeedback.jsx";
import { DeleteDialog, DeleteDialogActions } from "../components/common/DeleteDialog.js";
import { Client } from "@stomp/stompjs";

const PageContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  color: #242424;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #777;
  text-decoration: none;

  &:hover {
    color: #222;
    background-color: #f5f6f7;
  }
`;

const PageFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #eceef0;
`;

const PollHeader = styled.div`
  margin-bottom: 20px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-bottom: 12px;
`;

const PollTitleGroup = styled.div`
  display: flex;
  flex: 1 1 240px;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const PollTitle = styled.h2`
  min-width: 0;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

const PollMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #777;
`;

const StatusBadge = styled.span`
  flex: none;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  background-color: ${({ $closed }) => ($closed ? "#f1f2f4" : "#d9f5e2")};
  color: ${({ $closed }) => ($closed ? "#59605e" : "#075538")};
`;

const PollContent = styled.p`
  margin: 0 0 28px;
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const VoteSection = styled.section`
  margin-bottom: 40px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  margin: 0 0 24px;
  font-size: 18px;
  font-weight: 700;
`;

const VoteHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  ${SectionTitle} {
    margin: 0;
  }
`;

const TotalVotes = styled.span`
  color: #666;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(8px, 3vw, 16px);
  margin-bottom: 12px;
`;

const OptionImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 6px;

  &[hidden] {
    display: none;
  }
`;

const OptionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: clamp(8px, 2vw, 14px);
  border: 1px solid ${({ $selected }) => ($selected ? "#205c50" : "#dce7e1")};
  border-radius: 6px;
  background: ${({ $selected }) => ($selected ? "#f0f6f2" : "#fff")};
  color: inherit;
  font: inherit;
  text-align: left;
  overflow-wrap: anywhere;

  &:is(button) {
    cursor: pointer;
  }

  &:is(button):hover:not(:disabled) {
    background: #f6f7f6;
  }

  &:focus-visible {
    outline: 2px solid #205c50;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
  }
`;

const Notice = styled.div`
  margin-top: 16px;
  padding: 20px;
  background-color: #f1f2f4;
  color: #777;
  font-size: 13px;
  text-align: center;
  line-height: 1.7;
`;

const CommentSection = styled.section`
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid #e5e7eb;
`;

const CommentCount = styled.span`
  margin-inline-start: 6px;
  color: #59605e;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font: inherit;
  font-size: 14px;
  resize: vertical;
  margin-top: 20px;

  &:disabled {
    background-color: #f9f9f9;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  margin-bottom: 32px;
`;

const AuthorActions = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  gap: 8px;
  margin-left: auto;
`;

const AuthorButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #666;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? "#fff5f5" : "#f5f6f7")};
    border-color: ${({ $danger }) => ($danger ? "#f0caca" : "#cbd0d6")};
    color: ${({ $danger }) => ($danger ? "#b93d3d" : "#242424")};
  }

  &:focus-visible {
    outline: 2px solid #76879b;
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OptionName = styled.span`
  display: block;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 700;
`;

const OptionMedia = styled.span`
  display: grid;
  min-width: 0;

  ${OptionImage},
  ${OptionName} {
    grid-area: 1 / 1;
  }

  ${OptionImage} + ${OptionName} {
    align-self: end;
    justify-self: center;
    text-align: center;
    max-width: calc(100% - 16px);
    margin: 8px;
    padding: 4px 9px;
    border-radius: 4px;
    background: rgb(17 23 21 / 84%);
    color: #fff;
  }
`;

const RESULT_COLORS = ["#5572b1", "#a34f45"];

const ResultBar = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 40px;
  background-color: #626b77;
  border-radius: 2px;
  overflow: hidden;
`;

const ResultBarLabels = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 0 9px;
`;

const ResultBarLabel = styled.span`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 20px;
  white-space: nowrap;
`;

const ResultFill = styled.div`
  height: 100%;
  background-color: ${({ $second }) => RESULT_COLORS[$second ? 1 : 0]};

  @media (prefers-reduced-motion: no-preference) {
    transition: width 200ms ease;
  }
`;

const ResultDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  vertical-align: middle;
  border-radius: 50%;
  background-color: ${({ $second }) => RESULT_COLORS[$second ? 1 : 0]};
`;

const VoteHint = styled.p`
  margin: 10px 0 0;
  color: #59605e;
  font-size: 13px;
`;

const WinnerBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background-color: #e8edf3;
  color: #35455a;
  font-size: 12px;
  font-weight: 600;
  vertical-align: middle;
  white-space: nowrap;
`;

// 상세페이지에 이미지 추가
const PollImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 14px;
  margin: 0 auto 28px;
`;

function PollOptionImage({ option, onError }) {
  return (
    <OptionImage
      src={option.imageUrl}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => onError(option.imageUrl)}
    />
  );
}

const PollDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const deleteDialogRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await AxiosApi.pollDelete(id);
      deleteDialogRef.current?.close();
      nav("/", { replace: true });
    } catch (error) {
      const status = error.response?.status;
      setDeleteError(
        status === 403
          ? "작성자만 삭제할 수 있습니다."
          : status === 401
          ? "로그인이 필요합니다."
          : "투표 삭제에 실패했습니다."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const [poll, setPoll] = useState(null);
  const [failedPhoto, setFailedPhoto] = useState(null);
  const [pendingOptionId, setPendingOptionId] = useState(null);
  const voteInFlight = useRef(false);
  const [result, setResult] = useState(null);
  const [resultError, setResultError] = useState("");
  const [voteError, setVoteError] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isCommentSaving, setIsCommentSaving] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    AxiosApi.pollDetail(id)
      .then((response) => {
        const pollData = response.data;
        setPoll(pollData);

        const isClosed = new Date(pollData.deadline) <= new Date();

        // 비로그인 사용자는 진행 중인 결과 조회만 건너뛰고 상세는 표시합니다.
        const accessToken = localStorage.getItem("accessToken");
        if (!isClosed && !accessToken) {
          return;
        }

        // 상세 페이지 진입 시 투표 결과 조회
        AxiosApi.voteResult(id)
          .then((response) => {
            setResult(response.data);

            // 진행 중인데 결과 조회 성공 = 이미 투표한 사용자
            if (!isClosed) {
              setHasVoted(true);
              setShowResult(true);
            }
          })
          .catch((error) => {
            if (!isClosed && error.response?.status === 403) {
              // 아직 투표하지 않은 사용자
              return;
            }

            if (!isClosed && error.response?.status === 401) {
              // 로그인하지 않은 사용자
              return;
            }

            console.error("투표 결과 조회 실패:", error);
            setResultError("투표 결과를 불러오지 못했습니다.");
          });
      })
      .catch((error) => {
        console.error("투표 상세 조회 실패:", error);
        setLoadError(
          error.response?.status === 404
            ? "존재하지 않는 투표입니다."
            : "투표를 불러오지 못했습니다."
        );
      });
  }, [id]);

  useEffect(() => {
    AxiosApi.commentList(id)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("댓글 목록 조회 실패:", error);
      });
  }, [id]);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    const client = new Client({
      brokerURL: `${protocol}//${window.location.host}/ws`,

      onConnect: () => {
        client.subscribe(`/topic/polls/${id}`, async () => {
          if (!localStorage.getItem("accessToken")) return;

          try {
            const response = await AxiosApi.voteResult(id);
            setResult(response.data);
          } catch (error) {
            if (error.response?.status === 403) return;

            console.error("실시간 결과 조회 실패:", error);
          }
        });

        client.subscribe(`/topic/comments/${id}`, async () => {
          try {
            const response = await AxiosApi.commentList(id);
            setComments(response.data);
          } catch (error) {
            console.error("실시간 댓글 조회 실패:", error);
          }
        });
      },
    });

    client.activate();

    return () => {
      void client.deactivate();
    };
  }, [id]);

  if (loadError)
    return (
      <PageContainer>
        <BackLink to="/">← 투표 목록</BackLink>
        <p>{loadError}</p>
      </PageContainer>
    );

  if (!poll) {
    return <PageContainer>로딩 중...</PageContainer>;
  }

  const deadline = new Date(poll.deadline);
  const isClosed = deadline <= new Date();
  const hasResultView = isClosed || showResult;
  const options = poll.options ?? [];
  const showOptionPhotos = options.length === 2
    && options.every((option) => option.imageUrl?.trim() && option.imageUrl !== failedPhoto);
  const optionResults = options.map((option) => {
    const tally = result?.options.find(
      (item) => item.optionId === option.optionId
    );
    return {
      option,
      voteCount: tally?.voteCount ?? 0,
      percentage: tally?.percentage ?? 0,
    };
  });
  const highestVoteCount = Math.max(0, ...optionResults.map(({ voteCount }) => voteCount));
  const winningOptionId = isClosed && highestVoteCount > 0
    && optionResults.filter(({ voteCount }) => voteCount === highestVoteCount).length === 1
    ? optionResults.find(({ voteCount }) => voteCount === highestVoteCount).option.optionId
    : null;

  const handleVote = async (optionId) => {
    if (isClosed || voteInFlight.current) {
      return;
    }

    voteInFlight.current = true;
    setPendingOptionId(optionId);
    setVoteError("");
    try {
      if (hasVoted) {
        // 이미 투표한 경우 PUT
        await AxiosApi.voteUpdate(id, optionId);
      } else {
        try {
          // 최초 투표 POST
          await AxiosApi.voteCreate(id, optionId);
        } catch (error) {
          if (error.response?.status === 409) {
            // 이전에 투표한 사용자라면 PUT으로 변경
            await AxiosApi.voteUpdate(id, optionId);
          } else {
            throw error;
          }
        }
      }

      setHasVoted(true);

      // 투표 성공 후 결과 조회
      setResultError("");
      setShowResult(true);

      try {
        const response = await AxiosApi.voteResult(id);
        setResult(response.data);
        setResultError("");
      } catch (error) {
        console.error("투표 결과 조회 실패:", error);
        setResultError("투표는 반영됐지만 결과를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("투표 처리 실패:", error);

      if (error.response?.status === 401) {
        setVoteError("로그인이 필요합니다.");
      } else if (error.response?.status === 403) {
        setVoteError("투표를 변경할 권한이 없습니다.");
      } else {
        setVoteError("투표 처리 중 오류가 발생했습니다.");
      }
    } finally {
      voteInFlight.current = false;
      setPendingOptionId(null);
    }
  };

  const handleCommentCreate = async () => {
    if (isCommentSaving || !commentText.trim()) return;

    setIsCommentSaving(true);
    setCommentError("");
    try {
      await AxiosApi.commentCreate(id, commentText);
      setCommentText("");
      try {
        const response = await AxiosApi.commentList(id);
        setComments(response.data);
      } catch (error) {
        console.error("댓글 목록 조회 실패:", error);
        setCommentError("댓글은 등록됐지만 목록을 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      setCommentError(error.response?.status === 401 ? "로그인이 필요합니다." : "댓글 등록에 실패했습니다.");
    } finally {
      setIsCommentSaving(false);
    }
  };

  return (
    <PageContainer>
      <PollHeader>
        <TitleRow>
          <PollTitleGroup>
            <StatusBadge $closed={isClosed}>
              {isClosed ? "마감" : "진행 중"}
            </StatusBadge>
            <PollTitle>{poll.title}</PollTitle>
          </PollTitleGroup>
          {currentMemberId() === String(poll.authorId) && (
            <AuthorActions>
              <AuthorButton
                type="button"
                disabled={isDeleting}
                onClick={() => nav(`/votes/${id}/edit`)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m16 3 5 5-12 12-6 1 1-6L16 3Z" />
                  <path d="m13 6 5 5" />
                </svg>
                수정
              </AuthorButton>
              <AuthorButton
                type="button"
                $danger
                disabled={isDeleting}
                onClick={() => {
                  setDeleteError("");
                  deleteDialogRef.current?.showModal();
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
                </svg>
                {isDeleting ? "삭제 중..." : "삭제"}
              </AuthorButton>
            </AuthorActions>
          )}
        </TitleRow>
        <DeleteDialog
          ref={deleteDialogRef}
          aria-labelledby="delete-poll-title"
          aria-describedby="delete-poll-description"
          onCancel={(event) => {
            if (isDeleting) event.preventDefault();
          }}
        >
          <h2 id="delete-poll-title">투표를 삭제할까요?</h2>
          <p id="delete-poll-description">
            연결된 댓글과 투표 기록도 함께 삭제되며 복구할 수 없어요.
          </p>
          <FormFeedback>{deleteError}</FormFeedback>
          <DeleteDialogActions>
            <AuthorButton
              type="button"
              autoFocus
              disabled={isDeleting}
              onClick={() => deleteDialogRef.current?.close()}
            >
              취소
            </AuthorButton>
            <AuthorButton $danger type="button" disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? "삭제 중…" : "삭제하기"}
            </AuthorButton>
          </DeleteDialogActions>
        </DeleteDialog>

        <PollMeta>
          {poll.authorNickname && <span>{poll.authorNickname}</span>}
          <time dateTime={poll.deadline}>마감일: {deadline.toLocaleString("ko-KR")}</time>
        </PollMeta>

      </PollHeader>

      <VoteSection>
        <VoteHeading>
          <SectionTitle>
            {hasResultView ? "투표 결과" : "투표하기"}
          </SectionTitle>
          {hasResultView && result && <TotalVotes>총 {result.totalVotes}표</TotalVotes>}
        </VoteHeading>

        {hasResultView && !result ? (
          <Notice>{resultError || "투표 결과를 불러오는 중..."}</Notice>
        ) : (
          <>
            <OptionGrid>
              {optionResults.map(({ option }, index) => (
                <OptionCard
                  key={option.optionId}
                  as={isClosed ? "div" : "button"}
                  type={isClosed ? undefined : "button"}
                  $selected={pendingOptionId === option.optionId}
                  disabled={!isClosed && pendingOptionId !== null ? true : undefined}
                  onClick={isClosed ? undefined : () => handleVote(option.optionId)}
                >
                  <OptionMedia>
                    {showOptionPhotos && <PollOptionImage option={option} onError={setFailedPhoto} />}
                    <OptionName>
                      {hasResultView && <ResultDot $second={index === 1} aria-hidden="true" />}
                      {option.content}
                      {hasResultView && option.optionId === winningOptionId && (
                        <WinnerBadge>최다 득표</WinnerBadge>
                      )}
                    </OptionName>
                  </OptionMedia>
                </OptionCard>
              ))}
            </OptionGrid>
            {hasResultView && (
              <ResultBar>
                {optionResults.map(({ option, percentage }, index) => (
                  <ResultFill
                    key={option.optionId}
                    $second={index === 1}
                    style={{ width: `${percentage}%` }}
                    aria-hidden="true"
                  />
                ))}
                <ResultBarLabels>
                  {optionResults.map(({ option, voteCount, percentage }) => {
                    const label = `${voteCount}표 · ${percentage.toLocaleString(
                      "ko-KR",
                      { maximumFractionDigits: 1 }
                    )}%`;
                    return (
                      <ResultBarLabel
                        key={option.optionId}
                        aria-label={`${option.content}, ${label}`}
                      >
                        {label}
                      </ResultBarLabel>
                    );
                  })}
                </ResultBarLabels>
              </ResultBar>
            )}
            {hasResultView && !isClosed && <VoteHint>다른 선택지를 누르면 투표가 변경됩니다.</VoteHint>}
            {pendingOptionId !== null && <Notice role="status">투표 처리 중…</Notice>}
            {hasResultView && resultError && pendingOptionId === null && (
              <Notice role="status">{resultError}</Notice>
            )}
          </>
        )}
        <FormFeedback>{voteError}</FormFeedback>
      </VoteSection>

      {poll.content?.trim() && <PollContent>{poll.content}</PollContent>}
      {poll.contentImage && <PollImage src={poll.contentImage} alt="게시글 첨부 이미지" />}

      <CommentSection>
        <SectionTitle>
          댓글
          {comments.length > 0 && (
            <CommentCount>{comments.length.toLocaleString("ko-KR")}개</CommentCount>
          )}
        </SectionTitle>
        {comments.length === 0 ? (
          <Notice>아직 댓글이 없습니다.</Notice>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onUpdated={(updatedComment) => {
                setComments((previous) =>
                  previous.map((item) =>
                    item.commentId === updatedComment.commentId
                      ? updatedComment
                      : item
                  )
                );
              }}
              onDeleted={(deletedId) => {
                setComments((previous) =>
                  previous.filter((item) => item.commentId !== deletedId)
                );
              }}
            />
          ))
        )}
        <CommentInput
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
            setCommentError("");
          }}
          disabled={isCommentSaving}
          placeholder="이 질문에 대한 생각을 남겨주세요."
        />

        <FormFeedback>{commentError}</FormFeedback>
        <ButtonRow>
          <Button enabled={Boolean(commentText.trim()) && !isCommentSaving} size="short" onClick={handleCommentCreate}>
            {isCommentSaving ? "등록 중…" : "댓글 등록"}
          </Button>
        </ButtonRow>
      </CommentSection>
      <PageFooter>
        <BackLink to="/">← 투표 목록</BackLink>
      </PageFooter>
    </PageContainer>
  );
};

// 다른 투표로 이동할 때 화면 상태를 새로 시작합니다.
const PollDetailPage = () => {
  const { id } = useParams();
  return <PollDetail key={id} />;
};

export default PollDetailPage;
