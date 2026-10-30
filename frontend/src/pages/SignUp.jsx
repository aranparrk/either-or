import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi.jsx";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import ProfileChoice from "../components/common/ProfileChoice.jsx";

// 이메일: 공백·@ 없는 문자 + @ + 도메인 + . + 2자 이상 최상위 도메인
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 비밀번호: 8~20자, 영문 + 숫자 + 특수문자(!@#$%^&*) 각 1개 이상
const PWD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;


const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
`;

const Form = styled.form`
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

const Title = styled.h1`
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: bold;
`;

// 입력창 + 메시지를 한 묶음으로
const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

// 입력창 오른쪽 하단 메시지. 높이를 고정해 메시지가 생겨도 레이아웃이 흔들리지 않음
const Message = styled.p`
  margin: 4px 8px 0;
  min-height: 18px;
  text-align: right;
  font-size: 12px;
  color: ${({ $valid }) => ($valid ? "#2e9e4f" : "#e5484d")};
`;


const SignUp = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [inputPwdCheck, setInputPwdCheck] = useState("");
  const [inputProfileId, setInputProfileId] = useState(0);
  const [emailStatus, setEmailStatus] = useState("idle");

  const nav = useNavigate();

  const isEmail = EMAIL_REGEX.test(inputEmail)
  const isPwd = PWD_REGEX.test(inputPwd)
  const isPwdCheck = inputPwdCheck !== "" && inputPwd === inputPwdCheck
  const isProfileId = inputProfileId >= 1 && inputProfileId <= 5

  const selectProfile = (profileId) => {setInputProfileId(profileId)};

    useEffect(() => {
      let ignore = false;
      if (!isEmail) {
        return () => {
          ignore = true;
        };
      }

    const timer = setTimeout(async () => {
      try {
        if (ignore) return;
        setEmailStatus("checking")
        const res = await AxiosApi.memberExist(inputEmail);
        if (ignore) return;
        setEmailStatus(res.data === true ? "duplicate" : "available");
      } catch (err) {
        console.error("이메일 중복 확인 실패 ", err)
        if (!ignore) setEmailStatus("error");
      }
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [inputEmail, isEmail]);

  // 형식 OK + 중복 아님 이어야 최종 통과
  const isEmailOk = isEmail && emailStatus === "available";
  const isAllValid = isEmailOk && isPwd && isPwdCheck && isProfileId;


  // 이메일 메시지 문구
  const getEmailMessage = () => {
    if (!inputEmail) return "";
    if (!isEmail) return "이메일 형식이 올바르지 않습니다.";
    switch (emailStatus) {
      case "checking":
        return "중복 확인 중...";
      case "available":
        return "사용 가능한 이메일입니다.";
      case "duplicate":
        return "이미 가입된 이메일입니다.";
      case "error":
        return "중복 확인 중 오류가 발생했습니다.";
      default:
        return "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAllValid) return;

    const response = await AxiosApi.memberSignup(
      inputEmail,
      inputPwd,
      inputProfileId,
    );
    console.log(response.data);
    if (response.data === true) {
      alert(`회원가입이 완료되었습니다.`);
      nav("/", { replace: true }); // 로그인 페이지 경로에 맞게 수정
    } else {
      alert("회원 가입이 실패 했습니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Title>회원가입</Title>

        <Field>
          <Input
            type="email"
            value={inputEmail}
            placeholder="이메일"
            onChange={(e) => setInputEmail(e.target.value.trim())}
          />
          <Message $valid={isEmailOk}>{getEmailMessage()}</Message>
        </Field>

        <Field>
          <Input
            type="password"
            value={inputPwd}
            placeholder="비밀번호"
            onChange={(e) => setInputPwd(e.target.value)}
          />
          <Message $valid={isPwd}>
            {inputPwd &&
              (isPwd
                ? "사용 가능한 비밀번호입니다."
                : "영문, 숫자, 특수문자 포함 8~20자로 입력하세요.")}
          </Message>
        </Field>

        <Field>
          <Input
            type="password"
            value={inputPwdCheck}
            placeholder="비밀번호 확인"
            onChange={(e) => setInputPwdCheck(e.target.value)}
          />
          <Message $valid={isPwdCheck}>
            {inputPwdCheck &&
              (isPwdCheck
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다.")}
          </Message>
        </Field>

        <ProfileChoice
            onSelect={selectProfile}
            selectedId={inputProfileId}
        />

        <Button type="submit" enabled={isAllValid}>
          가입하기
        </Button>

      </Form>
    </Container>
  );
};

export default SignUp;