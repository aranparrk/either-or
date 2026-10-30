import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosApi";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

// 페이지 전체 영역
const PageContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  box-sizing: border-box;
  text-align: left;

  @media (max-width: 768px) {
    padding: 32px 16px 48px;
  }
`;

// 페이지 상단
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

const PageTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #222;
`;

const PageDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #888;
`;

// 투표 카드 목록
const PollGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

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

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    AxiosApi.pollList()
      .then((response) => {
        setPolls(response.data);
      })
      .catch((error) => {
        console.error("투표 목록 조회 실패 : ", error);
      });
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>투표 목록</PageTitle>
          <PageDescription>당신의 선택을 기다리는 다양한 투표</PageDescription>
        </div>

        <Button size="short" enabled={true} onClick={() => nav("/votes/new")}>
          투표 등록
        </Button>
      </PageHeader>

      <PollGrid>
        {polls.map((poll) => {
          const isClosed = new Date(poll.deadline) <= new Date();

          return (
            <PollCard key={poll.pollId} to={`/votes/${poll.pollId}`}>
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
        })}
      </PollGrid>
    </PageContainer>
  );
};

export default PollList;
