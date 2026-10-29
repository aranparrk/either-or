import styled from "styled-components";

// 리스트의 각 항목 (하위 컴포넌트)
const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.1s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 17px;
  /* 제목이 길면 한 줄로 자르고 ... 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
`;

// 부모(BoardList)로부터 게시글 데이터(board)와 클릭 핸들러(onClick)를 props로 받음
const BoardItem = ({ board, onClick }) => {
  return (
    <Item onClick={() => onClick(board.boardId)}>
      <Title>{board.title}</Title>
      <Meta>
        <span>{board.name || board.email}</span>
        <span>{board.regDate?.substring(0, 10)}</span>
      </Meta>
    </Item>
  );
};

export default BoardItem;
