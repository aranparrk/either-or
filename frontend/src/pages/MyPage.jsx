import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";
import EditMember from "../components/myPage/EditMember.jsx";

// 전체 영역
const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  box-sizing: border-box;
`;

// 제목
const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #222;
`;

// 설명
const Description = styled.p`
  margin: 0 0 32px;
  font-size: 14px;
  color: #888;
`;

// 메뉴 영역
const Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

// 메뉴 버튼
const MenuBtn = styled.button`
  padding: 10px 40px;
  border: 1px solid ${({ $active }) => ($active ? "#36393b" : "#b5b5b5")};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#36393b" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#222")};
  font-size: 15px;
  cursor: pointer;

  @media (max-width: 768px) {
    flex: 1;
    padding: 10px 0;
    font-size: 13px;
  }
`;

// 내용 영역
const Content = styled.div`
  min-height: 300px;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 12px;

  @media (max-width: 600px) {
    padding: 18px;
  }
`;

// 소제목
const SectionTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 700;
`;

// 목록
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

// 카드
const ItemCard = styled(Link)`
  display: block;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  text-decoration: none;
  color: #222;
  transition: 0.2s;

  &:hover {
    border-color: #777;
    background-color: #fafafa;
  }
`;

// 카드 제목
const ItemTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
`;

// 댓글 내용
const ItemText = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

// 날짜
const ItemDate = styled.span`
  font-size: 12px;
  color: #999;
`;

// 안내 문구
const EmptyMessage = styled.div`
  padding: 60px 10px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

// 개수
const Count = styled.p`
  margin: 0 0 16px;
  font-size: 13px;
  color: #888;
`;

// 마이페이지
const MyPage = () => {
  // 현재 선택된 메뉴
  const [activeTab, setActiveTab] = useState("info");

  // 내가 작성한 투표
  const [myPolls, setMyPolls] = useState([]);

  // 내가 작성한 댓글
  const [myComments, setMyComments] = useState([]);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 오류 메시지
  const [error, setError] = useState("");

  // 날짜 표시 함수
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("ko-KR");
  };

  // 내가 쓴 투표 조회
  useEffect(() => {
    if (activeTab !== "poll") return;

    let isMounted = true;

    const getMyPolls = async () => {
      setLoading(true);
      setError("");

      try {
        // 백엔드에 내 투표 조회 요청
        const response = await AxiosApi.myPollList();

        if (isMounted) {
          setMyPolls(response.data);
        }
      } catch (error) {
        console.error("내 투표 조회 실패:", error);

        if (isMounted) {
          setError("내가 작성한 투표를 불러오지 못했습니다.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getMyPolls();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // 내가 쓴 댓글 조회
  useEffect(() => {
    if (activeTab !== "comment") return;

    let isMounted = true;

    const getMyComments = async () => {
      setLoading(true);
      setError("");

      try {
        // 백엔드에 내 댓글 조회 요청
        const response = await AxiosApi.myCommentList();

        if (isMounted) {
          setMyComments(response.data);
        }
      } catch (error) {
        console.error("내 댓글 조회 실패:", error);

        if (isMounted) {
          setError("내가 작성한 댓글을 불러오지 못했습니다.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getMyComments();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <Container>
      <Title>마이페이지</Title>

      <Description>당신의 공간</Description>

      {/* 메뉴 버튼 */}
      <Menu>
        <MenuBtn
          $active={activeTab === "info"}
          onClick={() => setActiveTab("info")}
        >
          회원정보 변경
        </MenuBtn>

        <MenuBtn
          $active={activeTab === "poll"}
          onClick={() => setActiveTab("poll")}
        >
          내가 쓴 투표
        </MenuBtn>

        <MenuBtn
          $active={activeTab === "comment"}
          onClick={() => setActiveTab("comment")}
        >
          내가 쓴 댓글
        </MenuBtn>
      </Menu>

      <Content>
        {/* 회원정보 */}
        {activeTab === "info" && <h3>회원정보 변경 화면입니다.</h3>}

        {activeTab === "info" && (
          <>
            <EditMember />
          </>
        )}

        {/* 내가 쓴 투표 */}
        {activeTab === "poll" && (
          <>
            <SectionTitle>내가 쓴 투표</SectionTitle>

            {loading ? (
              <EmptyMessage>투표를 불러오는 중입니다.</EmptyMessage>
            ) : error ? (
              <EmptyMessage>{error}</EmptyMessage>
            ) : myPolls.length === 0 ? (
              <EmptyMessage>아직 작성한 투표가 없습니다.</EmptyMessage>
            ) : (
              <>
                <Count>총 {myPolls.length}개의 투표</Count>

                <ItemList>
                  {myPolls.map((poll) => (
                    <ItemCard key={poll.pollId} to={`/votes/${poll.pollId}`}>
                      <ItemTitle>{poll.title}</ItemTitle>

                      <ItemDate>작성일: {formatDate(poll.regDate)}</ItemDate>

                      <ItemDate>투표 참여자: {poll.totalVotes ?? 0}명</ItemDate>
                    </ItemCard>
                  ))}
                </ItemList>
              </>
            )}
          </>
        )}

        {/* 내가 쓴 댓글 */}
        {activeTab === "comment" && (
          <>
            <SectionTitle>내가 쓴 댓글</SectionTitle>

            {loading ? (
              <EmptyMessage>댓글을 불러오는 중입니다.</EmptyMessage>
            ) : error ? (
              <EmptyMessage>{error}</EmptyMessage>
            ) : myComments.length === 0 ? (
              <EmptyMessage>아직 작성한 댓글이 없습니다.</EmptyMessage>
            ) : (
              <>
                <Count>총 {myComments.length}개의 댓글</Count>

                <ItemList>
                  {myComments.map((comment) => (
                    <ItemCard
                      key={comment.commentId}
                      to={`/votes/${comment.pollId}`}
                    >
                      <ItemTitle>{comment.pollTitle}</ItemTitle>

                      <ItemText>{comment.content}</ItemText>

                      <ItemDate>작성일: {formatDate(comment.regDate)}</ItemDate>
                    </ItemCard>
                  ))}
                </ItemList>
              </>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default MyPage;
