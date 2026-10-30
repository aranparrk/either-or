import styled from "styled-components";

const StyledInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 1em;
  background-color: rgb(250, 250, 250);
  border-radius: 10px;
  font-size: 15px;
  outline: none;

  &:focus {
    border: 1px solid rgb(233, 233, 233);
  }
`;

const Input = ({ type = "text", value, onChange, placeholder }) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
