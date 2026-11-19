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
    border: 1px solid #747775;
    border-radius: 8px;
    background-color: #fff;
    color: #1f1f1f;
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: #f2f2f2;
    }

    &:active:not(:disabled) {
      background-color: #e8e8e8;
    }

    &:focus-visible {
      outline: 3px solid #4285f4;
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

const GoogleButton = ({ onClick, disabled = false, children }) => (
  <StyledButton type="button" onClick={onClick} disabled={disabled}>
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11a9.4 9.4 0 0 1-4.08 6.18v5.14h6.61c3.87-3.56 6.08-8.8 6.08-14.82Z" />
      <path fill="#34A853" d="M24 44c5.5 0 10.11-1.82 13.53-4.96l-6.61-5.14c-1.83 1.23-4.17 1.96-6.92 1.96-5.32 0-9.83-3.6-11.44-8.44H5.73v5.3A20 20 0 0 0 24 44Z" />
      <path fill="#FBBC05" d="M12.56 27.42A12 12 0 0 1 11.93 24c0-1.19.22-2.34.63-3.42v-5.3H5.73A20 20 0 0 0 4 24c0 3.23.77 6.28 2.13 8.98l6.43-5.56Z" />
      <path fill="#EA4335" d="M24 12.14c3 0 5.69 1.03 7.81 3.05l5.86-5.86C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.73 15.28l6.83 5.3C14.17 15.74 18.68 12.14 24 12.14Z" />
    </svg>
    {children}
  </StyledButton>
);

export default GoogleButton;
