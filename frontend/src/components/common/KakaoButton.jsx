import styled from "styled-components";

const StyledButton = styled.button`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 48px;
    margin-top: 0;
    padding: 0 16px;
    border: none;
    border-radius: 8px;
    background-color: #fee500;
    color: #191919;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: #fada00;
    }

    &:active:not(:disabled) {
      background-color: #f5d900;
    }

    &:focus-visible {
      outline: 3px solid #191919;
      outline-offset: 3px;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      flex-shrink: 0;
    }
  }
`;

const KakaoButton = ({ onClick, disabled = false, children }) => (
  <StyledButton type="button" onClick={onClick} disabled={disabled}>
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.477 3 2 6.582 2 11c0 2.85 1.86 5.352 4.66 6.766L5.5 21l4.06-2.435c.79.15 1.607.235 2.44.235 5.523 0 10-3.582 10-8S17.523 3 12 3Z"
      />
    </svg>
    {children}
  </StyledButton>
);

export default KakaoButton;
