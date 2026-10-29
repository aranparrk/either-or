import styled from "styled-components";

const StyledCancelBtn = styled.button`
  box-sizing: border-box;
  width: 100px;
  height: 50px;
  border: ipx solid rgb(55, 59, 62);
  background-color: white;
  border-radius: 10px;
  color: rgb(55, 59, 62);
  font-size: 15px;
  font-weight: 700;
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
