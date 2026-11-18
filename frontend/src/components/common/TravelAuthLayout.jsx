import styled from "styled-components";

const AuthPage = styled.div`
  display: grid;
  place-items: center;
  flex: 1;
  box-sizing: border-box;
  width: 100%;
  padding: clamp(24px, 5vw, 64px) 16px;
  background: #fff;
`;

const AuthPanel = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  padding: clamp(24px, 5vw, 40px);
  border: 1px solid #dce7e1;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(22, 66, 58, .06);
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 4px;
  color: #666;
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5ebe7;
  }
`;

export function AuthDivider() {
  return <Divider>또는</Divider>;
}

export default function TravelAuthLayout({ children }) {
  return (
    <AuthPage>
      <AuthPanel>
        {children}
      </AuthPanel>
    </AuthPage>
  );
}
