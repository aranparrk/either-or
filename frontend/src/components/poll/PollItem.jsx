import styled from "styled-components";
import { Link } from "react-router-dom";

// 투표 카드
const PollCard = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 220px;

  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;

  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: #c8c8c8;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid #555;
    outline-offset: 3px;
  }
`;

// 진행 상태
const StatusBadge = styled.span`
  display: inline-block;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;

  background-color: ${({ $closed }) => ($closed ? "#f1f2f4" : "#e8f6ee")};
  color: ${({ $closed }) => ($closed ? "#777" : "#238455")};
`;

// 투표 제목
const PollTitle = styled.h3`
  margin: 20px 0 24px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  color: #292929;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: anywhere;
`;

// 카드 하단
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid #f0f0f0;
`;

const Deadline = styled.span`
  font-size: 13px;
  color: #888;
`;

const DetailLink = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444;
`;

// 투표 카드 하나를 출력하는 컴포넌트
const PollItem = ({ poll }) => {
  const isClosed = new Date(poll.deadline) <= new Date();

  return (
    <PollCard to={`/votes/${poll.pollId}`}>
      <StatusBadge $closed={isClosed}>
        {isClosed ? "마감" : "진행 중"}
      </StatusBadge>

      <PollTitle>{poll.title}</PollTitle>

      <CardFooter>
        <Deadline>
          마감일: {new Date(poll.deadline).toLocaleString("ko-KR")}
        </Deadline>

        <DetailLink>자세히 보기 →</DetailLink>
      </CardFooter>
    </PollCard>
  );
};

export default PollItem;
