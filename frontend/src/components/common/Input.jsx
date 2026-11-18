import styled from "styled-components";

const StyledInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  color: #252525;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #373b3e;
  }

  &[aria-invalid="true"] {
    border-color: #bc5555;
  }
`;

const Input = ({ type = "text", ...props }) => {
  return (
    <StyledInput type={type} {...props} />
  );
};

export default Input;
