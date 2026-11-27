import styled from "styled-components";

export const SignupForm = styled.form`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;

  > label:not(:first-of-type) {
    margin-top: 12px;
  }

  button {
    width: 100%;
    margin-top: 14px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  color: #252525;
`;

export const Label = styled.label`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Message = styled.p`
  margin: 0;
  min-height: 18px;
  text-align: right;
  font-size: 12px;
  color: ${({ $valid }) => ($valid ? "#2e9e4f" : "#e5484d")};

  &[aria-busy="true"] {
    color: #666;
  }
`;
