import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosApi from "../api/AxiosApi";
import styled from "styled-components";

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
  margin-bottom: 28px;
  font-size: 14px;
  color: #777;
  text-decoration: none;

  &:hover {
    color: #222;
  }
`;

const PollHeader = styled.div`
  margin-bottom: 32px;
`;

const PollTitle = styled.h2`
  margin: 0 0 12px;
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
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  background-color: ${({ $closed }) => ($closed ? "#e9e9eb" : "#373a40")};
  color: ${({ $closed }) => ($closed ? "#666" : "#fff")};
`;

const PollContent = styled.p`
  margin: 0;
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const VoteSection = styled.section`
  max-width: 680px;
  margin: 0 auto 40px;
  padding: 28px;
  border: 1px solid #d1d5db;
  border-radius: 6px;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 24px;
  font-size: 18px;
  font-weight: 700;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid ${({ $selected }) => ($selected ? "#373a40" : "#d1d5db")};
  border-radius: 4px;
  background-color: ${({ $selected }) => ($selected ? "#f1f2f4" : "#fafafa")};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: #888;
  }

  input {
    accent-color: #373a40;
  }

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const VoteButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  background-color: #373a40;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    background-color: #e9e9eb;
    color: #999;
    cursor: not-allowed;
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

  &:disabled {
    background-color: #f9f9f9;
  }
`;

const PollDetail = () => {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [resultError, setResultError] = useState("");

  useEffect(() => {
    setPoll(null);
    setSelectedOptionId(null);
    setResult(null);
    setResultError("");

    AxiosApi.pollDetail(id)
      .then((response) => {
        const pollData = response.data;
        setPoll(pollData);

        const isClosed = new Date(pollData.deadline) <= new Date();

        if (isClosed) {
          AxiosApi.voteResult(id)
            .then((response) => {
              setResult(response.data);
            })
            .catch((error) => {
              console.error("투표 결과 조회 실패:", error);

              if (error.response?.status === 401) {
                setResultError("로그인이 필요합니다.");
              } else if (error.response?.status === 403) {
                setResultError("투표 결과 조회 권한이 없습니다.");
              } else {
                setResultError("투표 결과를 불러오지 못했습니다.");
              }
            });
        }
      })
      .catch((error) => {
        console.error("투표 상세 조회 실패:", error);
      });
  }, [id]);

  if (!poll) {
    return <PageContainer>로딩 중...</PageContainer>;
  }

  const isClosed = new Date(poll.deadline) <= new Date();

  const handleVote = async () => {
    if (selectedOptionId === null || isClosed || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await AxiosApi.voteCreate(id, selectedOptionId);

      console.log("투표 참여 성공:", response.data);
      alert("투표가 완료되었습니다.");
    } catch (error) {
      console.error("투표 참여 실패:", error);

      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else if (error.response?.status === 409) {
        alert("이미 참여한 투표입니다.");
      } else {
        alert("투표 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <BackLink to="/">← 투표 목록</BackLink>

      <PollHeader>
        <PollTitle>{poll.title}</PollTitle>

        <PollMeta>
          <StatusBadge $closed={isClosed}>
            {isClosed ? "마감" : "진행 중"}
          </StatusBadge>

          <span>마감일: {new Date(poll.deadline).toLocaleString("ko-KR")}</span>
        </PollMeta>

        <PollContent>{poll.content}</PollContent>
      </PollHeader>

      <VoteSection>
        <SectionTitle>{isClosed ? "투표 결과" : "투표하기"}</SectionTitle>

        {isClosed ? (
          result ? (
            <>
              <p>총 {result.totalVotes}표</p>

              {(poll.options ?? []).map((option) => {
                const optionResult = result.options.find(
                  (item) => item.optionId === option.optionId
                );

                return (
                  <div key={option.optionId}>
                    <p>
                      {option.content} : {optionResult?.voteCount ?? 0}표 (
                      {optionResult?.percentage ?? 0}%)
                    </p>
                  </div>
                );
              })}
            </>
          ) : (
            <Notice>{resultError || "투표 결과를 불러오는 중..."}</Notice>
          )
        ) : (
          <>
            {(poll.options ?? []).map((option) => (
              <OptionLabel
                key={option.optionId}
                $selected={selectedOptionId === option.optionId}
              >
                <input
                  type="radio"
                  name="pollOption"
                  value={option.optionId}
                  checked={selectedOptionId === option.optionId}
                  onChange={() => setSelectedOptionId(option.optionId)}
                />
                {option.content}
              </OptionLabel>
            ))}

            <VoteButton
              disabled={selectedOptionId === null || isSubmitting}
              onClick={handleVote}
            >
              {isSubmitting ? "처리 중..." : "투표하기"}
            </VoteButton>
          </>
        )}
      </VoteSection>

      <CommentSection>
        <SectionTitle>댓글</SectionTitle>
        <CommentInput
          placeholder="이 질문에 대한 생각을 남겨주세요."
          disabled
        />
        <Notice>댓글 기능은 아직 연결되지 않았습니다.</Notice>
      </CommentSection>
    </PageContainer>
  );
};

export default PollDetail;
