import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosApi";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import PollItem from "../components/poll/PollItem";

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
        {polls.map((poll) => (
          <PollItem key={poll.pollId} poll={poll} />
        ))}
      </PollGrid>
    </PageContainer>
  );
};

export default PollList;
