import styled from "styled-components";

const Item = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #eee;
`;

const Writer = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const Content = styled.p`
  font-size: 14px;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #888;
`;

const CommentItem = ({ comment }) => {
  return (
    <Item>
      <Writer>{comment.email}</Writer>
      <Content>{comment.content}</Content>
      <DateText>{new Date(comment.regDate).toLocaleString("ko-KR")}</DateText>
    </Item>
  );
};

export default CommentItem;
