import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosApi";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const PollCard = styled(Link)`
  display: block;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    border-color: #888;
  }
`;

const PollTitle = styled.h3`
  text-align: left;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: anywhere;
`;

const PageContainer = styled.main`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  box-sizing: border-box;
  text-align: left;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;

  background-color: ${({ $closed }) => ($closed ? "#3f4146" : "#194b3b")};

  color: ${({ $closed }) => ($closed ? "#cbd5e1" : "#a7f3d0")};
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
        <h2>투표 목록</h2>
        <Button size="short" enabled={true} onClick={() => nav("/votes/new")}>
          투표 등록
        </Button>
      </PageHeader>
      {polls.map((poll) => (
        <PollCard key={poll.pollId} to={`/votes/${poll.pollId}`}>
          <StatusBadge $closed={new Date(poll.deadline) <= new Date()}>
            {new Date(poll.deadline) > new Date() ? "진행 중" : "마감"}
          </StatusBadge>

          <PollTitle>{poll.title}</PollTitle>

          <p>마감일: {new Date(poll.deadline).toLocaleString("ko-KR")}</p>
        </PollCard>
      ))}
    </PageContainer>
  );
};

export default PollList;
