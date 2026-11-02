import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi.jsx";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import ProfileChoice from "../components/common/ProfileChoice.jsx";

// 이메일 형식 검증
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 비밀번호: 8~20자, 영문 + 숫자 + 특수문자
const PWD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 56px;
  padding: 48px 24px;

  @media (max-width: 820px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const Form1 = styled.div`
  width: 100%;
  max-width: 360px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > p {
    margin-bottom: 20px;
  }
`;

const Form2 = styled.form`
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 36px;
  gap: 8px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background-color: white;

  > label:not(:first-of-type) {
    margin-top: 12px;
  }

  button {
    width: 100%;
    margin-top: 14px;
  }
`;

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
  color: #252525;
`;

const Label = styled.label`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
`;

const Caption1 = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #666;
`;

const Caption2 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 24px;
  gap: 14px;
  background-color: rgb(234, 234, 234);
  border-radius: 10px;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Message = styled.p`
  margin: 4px 0 0;
  min-height: 18px;
  text-align: right;
  font-size: 12px;
  color: ${({ $valid }) => ($valid ? "#2e9e4f" : "#e5484d")};
`;

const SignUp = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [inputProfileId, setInputProfileId] = useState(0);
  const [emailStatus, setEmailStatus] = useState("idle");

  const nav = useNavigate();

  const isEmail = EMAIL_REGEX.test(inputEmail);
  const isPwd = PWD_REGEX.test(inputPwd);
  const isProfileId = inputProfileId >= 1 && inputProfileId <= 5;

  const selectProfile = (profileId) => {
    setInputProfileId(profileId);
  };

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
        setEmailStatus("checking");

        const res = await AxiosApi.memberExist(inputEmail);
        if (ignore) return;

        setEmailStatus(res.data === true ? "duplicate" : "available");
      } catch (error) {
        console.error("이메일 중복 확인 실패 ", error);
        if (!ignore) setEmailStatus("error");
      }
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [inputEmail, isEmail]);

  const isEmailOk = isEmail && emailStatus === "available";
  const isAllValid = isEmailOk && isPwd && isProfileId;

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
      inputProfileId
    );

    console.log(response.data);

    if (response.data === true) {
      alert("회원가입이 완료되었습니다.");
      nav("/login", { replace: true }); // 회원가입 완료 후 로그인 페이지로 이동
    } else {
      alert("회원 가입이 실패 했습니다.");
    }
  };

  return (
    <Container>
      <Form1>
        <Caption1>함께하는 즐거움!</Caption1>

        <Title>
          나의 선택으로
          <br />
          시작하는 이야기
        </Title>

        <Caption1>
          계정을 만들고 투표에 참여해보세요!
          <br />
          의견을 나누고, 질문을 직접 등록할 수 있습니다.
        </Caption1>

        <Caption2>
          <div>01 두 가지 선택 중 내 의견 남기기</div>
          <div>02 참여 후 투표 현황 확인하기</div>
          <div>03 궁금한 질문 투표로 만들기</div>
        </Caption2>
      </Form1>

      <Form2 onSubmit={onSubmit}>
        <Title>회원가입</Title>

        <Label>이메일</Label>
        <Field>
          <Input
            type="email"
            value={inputEmail}
            placeholder="이메일을 입력해주세요"
            onChange={(e) => setInputEmail(e.target.value.trim())}
          />
          <Message $valid={isEmailOk}>{getEmailMessage()}</Message>
        </Field>

        <Label>비밀번호</Label>
        <Field>
          <Input
            type="password"
            value={inputPwd}
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => setInputPwd(e.target.value)}
          />
          <Message $valid={isPwd}>
            {inputPwd &&
              (isPwd
                ? "사용 가능한 비밀번호입니다."
                : "영문, 숫자, 특수문자 포함 8~20자로 입력하세요.")}
          </Message>
        </Field>

        <Label>프로필</Label>
        <ProfileChoice onSelect={selectProfile} selectedId={inputProfileId} />

        <Button type="submit" enabled={isAllValid}>
          가입하기
        </Button>
      </Form2>
    </Container>
  );
};

export default SignUp;
