import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosApi";
import styled from "styled-components";
import { Link } from "react-router-dom";
import TravelCover from "../components/common/TravelCover.jsx";
import PollItem from "../components/poll/PollItem";

// 페이지 전체 영역
const PageContainer = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 32px clamp(24px, 3vw, 44px) 80px;
  box-sizing: border-box;
  text-align: left;

  @media (max-width: 768px) {
    padding: 32px 16px 48px;
  }
`;

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.3fr) minmax(270px, 1fr);
  grid-template-areas:
    "cover sidebar"
    "polls sidebar";
  grid-template-rows: auto 1fr;
  align-items: start;
  gap: 20px 24px;

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "cover" "search" "polls" "ranking" "assistant";
  }
`;

const CoverArea = styled.div`
  grid-area: cover;
`;

const PollArea = styled.section`
  grid-area: polls;
  min-width: 0;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  display: grid;
  gap: 20px;

  @media (max-width: 1000px) {
    display: contents;
  }
`;

const SidebarPanel = styled.section`
  padding: clamp(16px, 2.2vw, 26px);
  border: 1px solid #e0ede7;
  border-radius: 20px;
  background: linear-gradient(135deg, #f1f8f5, #e6f3ed);
`;

const SearchPanel = styled(SidebarPanel)`
  @media (max-width: 1000px) {
    grid-area: search;
  }
`;

const RankingPanel = styled(SidebarPanel)`
  @media (max-width: 1000px) {
    grid-area: ranking;
  }
  border-color: #e5eae7;
  background: #fff;
  box-shadow: 0 2px 5px rgb(20 43 34 / 7%);
`;

const AssistantPanel = styled(SidebarPanel)`
  @media (max-width: 1000px) {
    grid-area: assistant;
  }
`;

const PanelTitle = styled.h2`
  margin: 0;
  color: #173c35;
  font-size: 20px;
  line-height: 1.3;
`;

const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  margin-top: 14px;
  padding: 12px 16px;
  border: 1px solid #cdded5;
  border-radius: 999px;
  background: #fff;
  color: #173c35;
  font: inherit;
  font-size: 14px;

  &:focus-visible {
    outline: 2px solid #205c50;
    outline-offset: 2px;
  }
`;

const PanelMessage = styled.p`
  margin: 10px 0 0;
  color: #475e54;
  font-size: 14px;
  line-height: 1.5;
`;

const SearchMessage = styled.p`
  margin: 24px 0;
  color: #535d57;
  text-align: center;
`;

const CreatePollLink = styled(Link)`
  align-self: flex-start;
  margin-top: 20px;
  padding: 11px 17px;
  border-radius: 9px;
  background: #f4ebd6;
  color: #173c35;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;

  &:hover {
    background: #fff8e7;
  }
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
  margin: 0 0 16px;
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
  border: 1px solid ${({ $active }) => ($active ? "#205c50" : "#e0e9e4")};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#205c50" : "#fff")};
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    AxiosApi.pollList()
      .then((response) => {
        setPolls(response.data);
      })
      .catch((error) => {
        console.error("투표 목록 조회 실패 : ", error);
      });
  }, []);

  const keyword = search.trim().toLowerCase();
  const filteredPolls = polls
    .filter((poll) => {
      const matchesSearch = !keyword
        || poll.title?.toLowerCase().includes(keyword)
        || poll.options?.some((option) => option.content?.toLowerCase().includes(keyword));

      if (!matchesSearch) return false;

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
      <PageGrid>
        <CoverArea>
          <TravelCover
            wide
            title="다음 여행지는 어디로 갈까요?"
            description="두 여행지를 비교하고, 가고 싶은 곳에 한 표를 남겨보세요."
          >
            <CreatePollLink to="/votes/new">여행지 투표 만들기</CreatePollLink>
          </TravelCover>
        </CoverArea>

        <Sidebar aria-label="투표 도구">
          <SearchPanel aria-labelledby="poll-search-title">
            <PanelTitle id="poll-search-title">투표 검색</PanelTitle>
            <SearchInput
              type="search"
              aria-label="투표 제목 또는 선택지 이름 검색"
              placeholder="투표 제목 또는 선택지 이름"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </SearchPanel>

          <RankingPanel aria-labelledby="weekly-ranking-title">
            <PanelTitle id="weekly-ranking-title">주간랭킹</PanelTitle>
            <PanelMessage>주간 인기 투표 집계를 준비 중이에요.</PanelMessage>
          </RankingPanel>

          <AssistantPanel aria-labelledby="travel-assistant-title">
            <PanelTitle id="travel-assistant-title">AI 여행 도우미</PanelTitle>
            <PanelMessage>여행지 추천과 일정 안내를 준비 중이에요.</PanelMessage>
          </AssistantPanel>
        </Sidebar>

        <PollArea aria-label="투표 목록">
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
          {keyword && filteredPolls.length === 0 && (
            <SearchMessage role="status">검색 결과가 없습니다.</SearchMessage>
          )}
        </PollArea>
      </PageGrid>
    </PageContainer>
  );
};

export default PollList;
