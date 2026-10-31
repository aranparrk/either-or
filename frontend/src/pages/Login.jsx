import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AxiosApi from "../api/AxiosApi";

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Form1 = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 4px;
  align-items: flex-start;
`;

const Form2 = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 40px;
  gap: 4px;
  align-items: flex-start;
`;

const ABbox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 10px;
  justify-content: space-around;
`;

const Title = styled.h1`
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: bold;
`;

const Label = styled.label`
  margin: 0 0 5px;
  font-size: 15px;
  font-weight: bold;
`;

const Caption1 = styled.p`
  font-size: 10px;
`;

const Caption2 = styled.div`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: 20px;
  background-color: rgb(55, 59, 62);
  border-radius: 10px;
  color: white;
  font-size: 12px;
  text-align: center;
`;

const SignUpLink = styled(Link)`
  width: 100%;
  text-align: center;
  text-decoration: none;
`;

const Login = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");

  const nav = useNavigate();

  // 둘 다 입력돼야 버튼 활성화
  const isValid = inputEmail.trim() !== "" && inputPwd !== "";

  // form의 onSubmit으로 처리하면 Enter 키로도 로그인 가능
  const onSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    try {
      const response = await AxiosApi.memberLogin(inputEmail, inputPwd);

      if (response.data) {
        localStorage.setItem("isLogin", "TRUE");
        localStorage.setItem("email", inputEmail);
        nav("/votes", { replace: true }); // 뒤로가기로 로그인 화면에 다시 오지 않도록
      } else {
        alert("이메일 또는 비밀번호가 틀립니다.");
      }
    } catch (errer) {
        console.error("로그인 오류", errer);
        alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
  };

  return (
    <Container>
      <Form1>
        <Caption1>찬반 토론의 시작!</Caption1>
        <br/>
        <Title>당신의 생각은<br/>어느 쪽인가요?</Title>
        <br/>
        <Caption1>두 가지 선택 사이, 나의 의견을 남겨보세요.
          <br/>
          투표에 참여하고 대중의 선택을 볼 수 있습니다.</Caption1>
        <ABbox>
          <Caption2>
            <Title>A</Title>
            <Caption1>당신의 선택</Caption1>
          </Caption2>
          <Caption2>
            <Title>B</Title>
            <Caption1>당신의 선택</Caption1>
          </Caption2>
        </ABbox>
      </Form1>
      <Form2 onSubmit={onSubmit}>
        <Title>로그인</Title>
        <Label>이메일</Label>
        <Input
          type="email"
          value={inputEmail}
          placeholder="이메일을 입력해주세요"
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={inputPwd}
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => setInputPwd(e.target.value)}
        />
        <Button type="submit" enabled={isValid}>
          로그인
        </Button>
        <SignUpLink to="/signup">회원가입으로 이동</SignUpLink>
      </Form2>
    </Container>
  );
};

export default Login;