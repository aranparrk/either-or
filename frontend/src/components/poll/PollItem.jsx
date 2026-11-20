import styled from "styled-components";
import { Link } from "react-router-dom";

const PollCard = styled.article`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 14px clamp(12px, 2vw, 18px) 16px;
  border: 1px solid #cdd8d2;
  border-radius: 6px;
  background: #fff;
  color: inherit;
  transition: background 0.2s;
  &:hover {
    background: #f6f7f6;
  }
`;
const StatusBadge = styled.span`
  display: inline-block;
  align-self: flex-start;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $closed }) => ($closed ? "#f1f2f4" : "#d9f5e2")};
  color: ${({ $closed }) => ($closed ? "#59605e" : "#075538")};
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const VoteCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #535d57;
  white-space: nowrap;
`;
const FavoriteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 32px;
  min-height: 30px;
  padding: 3px 6px;
  border: 1px solid ${({ $active }) => ($active ? "#e5b93f" : "#dce4df")};
  border-radius: 7px;
  background: ${({ $active }) => ($active ? "#fff8df" : "#fff")};
  color: ${({ $active }) => ($active ? "#d69b00" : "#78847d")};
  cursor: pointer;
  font-size: 19px;
  line-height: 1;
  &:hover {
    background: #fff8df;
    color: #d69b00;
  }
  &:focus-visible {
    outline: 2px solid #086646;
    outline-offset: 2px;
  }
  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`;
const PollInfo = styled.div`
  display: grid;
  gap: 12px;
  margin: 8px 0 12px;
`;
const PollContentLink = styled(Link)`
  display: grid;
  gap: 12px;
  color: inherit;
  text-decoration: none;
  &:focus-visible {
    outline: 2px solid #086646;
    outline-offset: 3px;
  }
`;
const PollTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;
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
const NewLabel = styled.span`
  flex: none;
  color: #b42318;
  font-size: 11px;
  font-weight: 700;
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
  background: #eef4f0;
  color: #4e6359;
  font-size: 13px;
`;
const OptionImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
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
  color: ${({ $second }) => ($second ? "#bd4e3d" : "#086646")};
`;
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

const PollItem = ({
  poll,
  isNew,
  isFavorite = false,
  onToggleFavorite,
  favoriteLoading = false,
  isLoggedIn = false,
}) => {
  const isClosed = new Date(poll.deadline) <= new Date();

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite?.(poll.pollId);
  };

  return (
    <PollCard>
      <CardHeader>
        <StatusBadge $closed={isClosed}>
          {isClosed ? "마감" : "진행 중"}
        </StatusBadge>

        <HeaderActions>
          <VoteCount>
            <span aria-hidden="true">👥</span> {poll.totalVotes ?? 0}명 참여
          </VoteCount>
          <FavoriteButton
            type="button"
            $active={isFavorite}
            aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            aria-pressed={isFavorite}
            title={
              !isLoggedIn
                ? "로그인 후 즐겨찾기를 사용할 수 있습니다."
                : isFavorite
                  ? "즐겨찾기 해제"
                  : "즐겨찾기"
            }
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
          >
            {isFavorite ? "★" : "☆"}
          </FavoriteButton>
        </HeaderActions>
      </CardHeader>

      <PollInfo>
        <PollContentLink to={`/votes/${poll.pollId}`}>
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
                  <OptionLabel
                    title={
                      option?.content ? `${label} ${option.content}` : undefined
                    }
                  >
                    <OptionLetter $second={index === 1}>{label}</OptionLetter>
                    {option?.content && ` ${option.content}`}
                  </OptionLabel>
                </OptionMedia>
              );
            })}
          </OptionGrid>
        </PollContentLink>
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
