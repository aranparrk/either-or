import styled from "styled-components";

const Message = styled.p`
  margin: 8px 0;
  color: ${({ $error }) => ($error ? "#a32b2b" : "#205c50")};
  font-size: 14px;
  line-height: 1.45;
`;

export default function FormFeedback({ children, error = true, id }) {
  if (!children) return null;
  return <Message id={id} $error={error} role={error ? "alert" : "status"}>{children}</Message>;
}
