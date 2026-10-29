import styled, { css } from "styled-components";

const btnSizes = {
  // 로그인, 회원가입 버튼 스타일
  long: css`
    width: 100%;
  `,
  // 투표등록, 댓글등록 버튼 스타일
  short: css`
    width: 100px;
  `,
};

const StyledBtn = styled.button`
  box-sizing: border-box;
  height: 50px;
  border: none;
  background-color: rgb(55, 59, 62);
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: not-allowed;

  /* size 값에 따라 버튼 사이즈 변경
  || btnSizes.long : 버튼 size 값에 long, short가 아닌 다른 값이 들어왔을 때에도 long 스타일을 적용 */
  ${({ $size }) => btnSizes[$size] || btnSizes.long}

  /* 등록 버튼, enabled가 true면 활성화 되는 버튼 스타일 */
  ${({ $cancel, $enabled }) =>
    !$cancel &&
    $enabled &&
    css`
      background-color: rgb(75, 79, 82);
      cursor: pointer;

      &:active {
        background-color: rgb(55, 59, 62);
      }
    `}
  
  /* 취소 버튼 */
  ${({ $cancel }) =>
    $cancel &&
    css`
      width: 100px;
      border: 1px solid rgb(55, 59, 62);
      background-color: white;
      color: rgb(55, 59, 62);
      cursor: pointer;
    `}
`;

const Button = ({
  type = "button",
  size = "long",
  enabled = false,
  cancel = false,
  onClick,
  children,
}) => {
  return (
    <StyledBtn
      type={type}
      $size={size}
      $enabled={enabled}
      $cancel={cancel}
      disabled={!cancel && !enabled}
      onClick={onClick}
    >
      {children}
    </StyledBtn>
  );
};

export default Button;
