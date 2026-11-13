import { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import AxiosApi from "../api/AxiosApi";
import { currentMemberId } from "../api/currentMemberId";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/common/ImageUpload.jsx";

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
  gap: 12px;
  margin-top: 10px;
`;

const PollCreate = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loadedId, setLoadedId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [originalDeadline, setOriginalDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [deadline, setDeadline] = useState("");
  const [contentImage, setContentImage] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!id) return;
    let active = true;
    AxiosApi.pollDetail(id).then(({ data }) => {
      if (!active) return;
      if (currentMemberId() !== String(data.authorId)) {
        setLoadError("작성자만 수정할 수 있습니다.");
        return;
      }
      setTitle(data.title);
      setContent(data.content);
      setOptionA(data.options[0].content);
      setOptionB(data.options[1].content);
      setDeadline(data.deadline);
      setOriginalDeadline(data.deadline);
      setContentImage(data.contentImage);
      setTotalVotes(data.totalVotes);
      setLoadedId(id);
    }).catch(() => {
      if (active) setLoadError("투표를 불러오지 못했습니다.");
    });
    return () => { active = false; };
  }, [id]);

  const handleCreate = async () => {
    if (isSaving || (isEdit && loadedId !== id)) return;
    if (title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }

    if (optionA.trim() === "" || optionB.trim() === "") {
      alert("선택지를 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (title.length > 200 || optionA.length > 255 || optionB.length > 255) {
      alert("제목은 200자, 선택지는 255자 이하로 입력해주세요.");
      return;
    }
    if (deadline === "" || (deadline !== originalDeadline && new Date(deadline) <= new Date())) {
      alert("마감일자를 정확히 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      if (isEdit) {
        await AxiosApi.pollUpdate(id, { title, content, options: [optionA, optionB], deadline, contentImage });
      } else {
        await AxiosApi.pollCreate(title, content, [optionA, optionB], deadline, contentImage);
      }
      alert(isEdit ? "투표가 수정되었습니다." : "투표가 등록되었습니다.");
      nav(isEdit ? `/votes/${id}` : "/");
    } catch (error) {
      console.error("투표 등록 실패:", error);
      const status = error.response?.status;
      alert(status === 403 ? "작성자만 수정할 수 있습니다." : status === 401 ? "로그인이 필요합니다." : status === 409 ? "참여자가 생겨 선택지를 수정할 수 없습니다. 페이지를 새로고침해주세요." : "저장에 실패했습니다. 입력 내용과 마감일시를 확인해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && (loadError || loadedId !== id)) {
    return <Container><p>{loadError || "로딩 중..."}</p><Button enabled size="short" onClick={() => nav(`/votes/${id}`)}>돌아가기</Button></Container>;
  }

  return (
    <Container>
      <Title>{isEdit ? "투표 수정" : "투표 등록"}</Title>
      <Description>
        {isEdit ? "참여자가 있는 투표는 선택지를 수정할 수 없습니다." : "두 가지 선택지를 등록하고 사람들의 의견을 들어보세요."}
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
          {isEdit && contentImage && <img src={contentImage} alt="등록된 이미지" style={{ maxWidth: "100%", maxHeight: 250, objectFit: "contain" }} />}
          <ImageUpload onImageSelect={setContentImage} />
          {isEdit && contentImage && <Button enabled={!isSaving} size="short" onClick={() => setContentImage(null)}>이미지 삭제</Button>}
        </Field>

        <OptionRow>
          <Field>
            <span>선택지 A</span>
            <Input
              disabled={isEdit && totalVotes > 0}
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="첫 번째 선택지"
            />
          </Field>

          <Field>
            <span>선택지 B</span>
            <Input
              disabled={isEdit && totalVotes > 0}
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
          {isEdit && <Button enabled={!isSaving} size="short" onClick={() => nav(`/votes/${id}`)}>취소</Button>}
          <Button enabled={!isSaving} size="short" onClick={handleCreate}>
            {isSaving ? "저장 중..." : isEdit ? "수정 저장" : "투표 등록"}
          </Button>
        </ButtonRow>
      </Form>
    </Container>
  );
};

export default PollCreate;
