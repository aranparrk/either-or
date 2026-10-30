import { useState } from "react";
import styled from "styled-components";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import AxiosApi from "../api/AxiosApi";

const Container = styled.div`
  box-sizing: border-box;
  width: calc(100% - 32px);
  max-width: 720px;
  margin: 50px auto;
  padding: 40px;
  background-color: white;
  border: 1px solid #e9e9e9;
  border-radius: 16px;

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 10px 0 0;
  color: #888;
  font-size: 14px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 36px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 10px;

  span {
    font-size: 14px;
    font-weight: 600;
  }

  input {
    border: 1px solid #e9e9e9;
  }

  input:focus {
    border-color: #999;
  }
`;

const OptionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StyledTextarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 140px;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
  font: inherit;
  font-size: 15px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #999;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const PollCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleCreate = async () => {
    if (title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }

    if (optionA.trim() === "" || optionB.trim() === "") {
      alert("선택지를 입력해주세요.");
      return;
    }

    if (deadline === "" || new Date(deadline) <= new Date()) {
      alert("마감일자를 정확히 입력해주세요.");
      return;
    }

    try {
      const response = await AxiosApi.pollCreate(
        title,
        content,
        [optionA, optionB],
        deadline
      );

      console.log("투표 등록 성공:", response.data);
      alert("투표가 등록되었습니다.");
    } catch (error) {
      console.error("투표 등록 실패:", error);
      alert("투표 등록에 실패했습니다.");
    }
  };

  return (
    <Container>
      <Title>투표 등록</Title>
      <Description>
        두 가지 선택지를 등록하고 사람들의 의견을 들어보세요.
      </Description>

      <Form>
        <Field>
          <span>투표 제목</span>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="투표 제목을 입력해주세요."
          />
        </Field>

        <Field>
          <span>내용</span>
          <StyledTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="투표에 대한 설명을 입력해주세요."
          />
        </Field>

        <OptionRow>
          <Field>
            <span>선택지 A</span>
            <Input
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="첫 번째 선택지"
            />
          </Field>

          <Field>
            <span>선택지 B</span>
            <Input
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="두 번째 선택지"
            />
          </Field>
        </OptionRow>

        <Field>
          <span>투표 마감일시</span>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </Field>

        <ButtonRow>
          <Button enabled={true} size="short" onClick={handleCreate}>
            투표 등록
          </Button>
        </ButtonRow>
      </Form>
    </Container>
  );
};

export default PollCreate;
