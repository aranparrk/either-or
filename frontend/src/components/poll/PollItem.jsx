import styled from "styled-components";
import { Link } from "react-router-dom";

// 투표 카드
const PollCard = styled(Link)`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 14px clamp(12px, 2vw, 18px) 16px;
  border: 1px solid #cdd8d2;
  border-radius: 6px;
  background: #fff;
  color: inherit;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      background: #f6f7f6;
    }
  }

  &:focus-visible {
    outline: 2px solid #086646;
    outline-offset: 3px;
  }
`;

// 진행 상태
const StatusBadge = styled.span`
  display: inline-block;
  align-self: flex-start;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;

  background-color: ${({ $closed }) => ($closed ? "#f1f2f4" : "#d9f5e2")};
  color: ${({ $closed }) => ($closed ? "#59605e" : "#075538")};
`;

const PollInfo = styled.div`
  display: grid;
  gap: 12px;
  margin: 8px 0 12px;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const OptionMedia = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  justify-items: center;
  width: 100%;
  min-width: 0;
  aspect-ratio: 2 / 1;
  min-height: 84px;
  padding: 4px 6px;
  overflow: hidden;
  border-radius: 6px;
  background-color: #eef4f0;
  color: #4e6359;
  font-size: 13px;
`;

const OptionImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;`;

const ImagePlaceholder = styled.span`
  align-self: center;
`;

const OptionLabel = styled.div`
  position: relative;
  grid-row: 2;
  min-width: 0;
  max-width: 100%;
  padding: 4px 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgb(255 255 255 / 94%);
  color: #17231d;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OptionLetter = styled.span`
  color: ({ $second }) => ($second ? "#bd4e3d" : "#086646");
`;

const PollTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const NewLabel = styled.span`
  flex: none;
  color: #b42318;
  font-size: 11px;
  font-weight: 700;
`;

// 투표 제목
const PollTitle = styled.h3`
  min-width: 0;
  margin: 0;
  font-size: clamp(17px, 2.2vw, 20px);
  font-weight: 700;
  line-height: 1.35;
  color: #17231d;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// 카드 하단
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin-top: auto;
`;

const Deadline = styled.span`
  font-size: 13px;
  color: #535d57;
`;

// 카드 상단
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

// 투표 참여자 수
const VoteCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #535d57;
  white-space: nowrap;
`;

// 투표 카드 하나를 출력하는 컴포넌트
const PollItem = ({ poll, isNew }) => {
  const isClosed = new Date(poll.deadline) <= new Date();

  return (
    <PollCard to={`/votes/${poll.pollId}`}>
      <CardHeader>
        <StatusBadge $closed={isClosed}>
          {isClosed ? "마감" : "진행 중"}
        </StatusBadge>

        <VoteCount><span aria-hidden="true">👥</span> {poll.totalVotes}명 참여</VoteCount>
      </CardHeader>

      <PollInfo>
        <PollTitleRow>
          <PollTitle title={poll.title}>{poll.title}</PollTitle>
          {isNew && <NewLabel>NEW</NewLabel>}
        </PollTitleRow>

        <OptionGrid>
          {["A", "B"].map((label, index) => {
            const option = poll.options?.[index];
            const imageUrl = option?.imageUrl?.trim();

            return (
              <OptionMedia key={label}>
                {imageUrl ? (
                  <OptionImage src={imageUrl} alt="" loading="lazy" />
                ) : (
                  <ImagePlaceholder>이미지 준비중</ImagePlaceholder>
                )}
                <OptionLabel title={option?.content ? `${label} ${option.content}` : undefined}>
                  <OptionLetter $second={index === 1}>{label}</OptionLetter>
                  {option?.content && ` ${option.content}`}
                </OptionLabel>
              </OptionMedia>
            );
          })}
        </OptionGrid>
      </PollInfo>

      <CardFooter>
        <Deadline>
          마감일: {new Date(poll.deadline).toLocaleString("ko-KR")}
        </Deadline>
      </CardFooter>
    </PollCard>
  );
};

export default PollItem;
