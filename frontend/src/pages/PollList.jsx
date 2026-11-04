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

// 필터 및 정렬 영역
const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

// 필터 버튼 그룹
const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// 필터 버튼
const FilterButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ $active }) => ($active ? "#36393b" : "#e8e8e8")};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#36393b" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#777")};
  font-size: 13px;
  cursor: pointer;
`;

// 정렬 선택
const SortSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #fff;
  color: #444;
  font-size: 13px;
  cursor: pointer;
`;

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
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

  const filteredPolls = polls
    .filter((poll) => {
      const isClosed = new Date(poll.deadline) <= new Date();

      if (filter === "ongoing") {
        return !isClosed;
      }

      if (filter === "closed") {
        return isClosed;
      }

      return true;
    })
    .sort((a, b) => {
      if (sort === "popular") {
        return b.totalVotes - a.totalVotes;
      }

      return new Date(b.regDate) - new Date(a.regDate);
    });

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

      <FilterBar>
        <FilterGroup>
          <FilterButton
            $active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            전체
          </FilterButton>

          <FilterButton
            $active={filter === "ongoing"}
            onClick={() => setFilter("ongoing")}
          >
            진행 중
          </FilterButton>

          <FilterButton
            $active={filter === "closed"}
            onClick={() => setFilter("closed")}
          >
            마감
          </FilterButton>
        </FilterGroup>

        <SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
        </SortSelect>
      </FilterBar>

      <PollGrid>
        {filteredPolls.map((poll) => (
          <PollItem key={poll.pollId} poll={poll} />
        ))}
      </PollGrid>
    </PageContainer>
  );
};

export default PollList;
