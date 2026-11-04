import styled, { css } from "styled-components";

const btnSizes = {
  // 로그인, 회원가입 버튼
  long: css`
    width: 100%;
  `,

  // 투표등록, 댓글등록 버튼
  short: css`
    min-width: 100px;
    padding: 0 20px;
  `,
};

const StyledBtn = styled.button`
  box-sizing: border-box;
  height: 44px;
  border: 1px solid transparent;
  background-color: #e9eaec;
  border-radius: 9px;
  color: #969ba1;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: not-allowed;

  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  ${({ $size }) => btnSizes[$size] || btnSizes.long}

  ${({ $enabled }) =>
    $enabled &&
    css`
      background-color: #30363d;
      color: #fff;
      cursor: pointer;

      &:hover {
        background-color: #454d56;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
      }

      &:active {
        background-color: #252a30;
        transform: translateY(0);
        box-shadow: none;
      }

      &:focus-visible {
        outline: 2px solid #76879b;
        outline-offset: 3px;
      }
    `}
`;

const Button = ({
  enabled,
  onClick,
  children,
  type = "button",
  size = "long",
}) => {
  return (
    <StyledBtn
      type={type}
      $enabled={enabled}
      $size={size}
      disabled={!enabled}
      onClick={onClick}
    >
      {children}
    </StyledBtn>
  );
};

export default Button;
