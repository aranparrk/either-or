import styled from "styled-components";

const StyledCancelBtn = styled.button`
  box-sizing: border-box;
  width: 80px;
  height: 32px;
  border: 1px solid rgb(180, 180, 180);
  background-color: white;
  border-radius: 10px;
  color: rgb(55, 59, 62);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = ({ onClick, children }) => {
  return (
    <StyledCancelBtn type="button" onClick={onClick}>
      {children}
    </StyledCancelBtn>
  );
};

export default CancelButton;
