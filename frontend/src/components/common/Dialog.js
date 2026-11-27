import styled from "styled-components";

export const Dialog = styled.dialog`
  width: min(420px, calc(100% - 32px));
  box-sizing: border-box;
  padding: 24px;
  border: 1px solid #dce7e1;
  border-radius: 8px;
  background: #fff;
  color: #242424;

  &::backdrop {
    background: rgb(0 0 0 / 40%);
  }

  h2 {
    margin: 0 0 10px;
    font-size: 20px;
  }

  h2 + p {
    margin: 0;
    color: #535d57;
    font-size: 14px;
    line-height: 1.6;
  }
`;

export const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;
