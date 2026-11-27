import { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import FormFeedback from "../components/common/FormFeedback.jsx";
import AxiosApi from "../api/AxiosApi";
import { currentMemberId } from "../api/currentMemberId";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/common/ImageUpload.jsx";
import TourOptionField from "../components/poll/TourOptionField.jsx";

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 44px 24px 56px;

  @media (max-width: 600px) {
    padding: 28px 16px 40px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ $highlighted }) => ($highlighted ? "#a32b2b" : "#666")};
  font-size: 14px;
  font-weight: ${({ $highlighted }) => ($highlighted ? 600 : 400)};
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
  }

  > p {
    margin: 0;
  }
`;

const OptionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  ${({ $locked }) =>
    $locked &&
    `
    cursor: not-allowed;

    > fieldset {
      pointer-events: none;
    }
  `}

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonPreview = styled.div`
  display: grid;
  gap: 8px;

  > p {
    margin: 0;
  }
`;

const ComparisonActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 12px;

  > p {
    margin: 0 auto 0 0;
  }
`;

const ComparisonButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #cdded5;
  border-radius: 8px;
  background: #fff;
  color: #205c50;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:enabled:hover {
    background: #f3f8f5;
  }

  &:focus-visible {
    outline: 2px solid #205c50;
    outline-offset: 2px;
  }

  &:disabled {
    border-color: #e5e7eb;
    color: #737b83;
    cursor: not-allowed;
  }
`;

const ComparisonResult = styled.p`
  box-sizing: border-box;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #dce9e4;
  border-radius: 10px;
  background: #f7faf8;
  color: #293b36;
  font-size: 14px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const StyledTextarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 88px;
  padding: 12px 16px;
  background-color: #fff;
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

const CoverDetails = styled.details`
  summary {
    width: fit-content;
    color: #205c50;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const CoverBody = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 12px;

  img {
    max-width: 100%;
    max-height: 250px;
    object-fit: contain;
  }

  > button {
    justify-self: start;
  }
`;

const DeadlineField = styled(Field)`
  width: min(100%, 320px);
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e9e9e9;
`;

function defaultDeadline() {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);
  const localTime = deadline.getTime() - deadline.getTimezoneOffset() * 60_000;
  return new Date(localTime).toISOString().slice(0, 16);
}

const PollCreate = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loadedId, setLoadedId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [fieldError, setFieldError] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showDeadlineHint, setShowDeadlineHint] = useState(false);
  const deadlineOnly = isEdit && totalVotes > 0;
  const [originalDeadline, setOriginalDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [tourA, setTourA] = useState(null);
  const [tourB, setTourB] = useState(null);
  const [deadline, setDeadline] = useState(() =>
    isEdit ? "" : defaultDeadline()
  );
  const [contentImage, setContentImage] = useState(null);
  const nav = useNavigate();
  const hasComparisonInput = Boolean(
    title.trim() && optionA.trim() && optionB.trim()
  );
  const comparisonInput = {
    title: title.trim(),
    optionA: optionA.trim(),
    optionB: optionB.trim(),
    contentIdA: tourA?.contentId ?? null,
    contentIdB: tourB?.contentId ?? null,
  };
  const comparisonInputKey = JSON.stringify(comparisonInput);
  const currentComparison =
    comparison?.inputKey === comparisonInputKey ? comparison : null;

  useEffect(() => {
    if (!id) return;
    let active = true;
    AxiosApi.pollDetail(id)
      .then(({ data }) => {
        if (!active) return;
        if (currentMemberId() !== String(data.authorId)) {
          setLoadError("작성자만 수정할 수 있습니다.");
          return;
        }
        setTitle(data.title);
        setContent(data.content ?? "");
        setOptionA(data.options[0].content);
        setOptionB(data.options[1].content);
        const toSpot = ({ contentId, content, imageUrl }) =>
          contentId ? { contentId, title: content, imageUrl } : null;
        setTourA(toSpot(data.options[0]));
        setTourB(toSpot(data.options[1]));
        setDeadline(data.deadline);
        setOriginalDeadline(data.deadline);
        setContentImage(data.contentImage);
        setTotalVotes(data.totalVotes);
        setLoadedId(id);
      })
      .catch(() => {
        if (active) setLoadError("투표를 불러오지 못했습니다.");
      });
    return () => {
      active = false;
    };
  }, [id]);

  const showFieldError = (field, message) => {
    setFieldError({ field, message });
    document.getElementById(field)?.focus();
  };

  const errorFor = (field) =>
    fieldError?.field === field ? fieldError.message : "";

  const updateField = (field, setter, value) => {
    setter(value);
    setFieldError((error) => (error?.field === field ? null : error));
  };

  const redirectToDeadline = (event) => {
    if (!deadlineOnly) return;
    event.preventDefault();
    setShowDeadlineHint(true);
    const input = document.getElementById("poll-deadline");
    input?.focus({ preventScroll: true });
    input?.scrollIntoView({ block: "center" });
  };

  const validatePollText = () => {
    if (title.trim() === "") {
      showFieldError("poll-title", "제목을 입력해주세요.");
      return false;
    }

    if (title.length > 200) {
      showFieldError("poll-title", "제목은 200자 이하로 입력해주세요.");
      return false;
    }

    for (const [field, option] of [
      ["poll-option-a", optionA],
      ["poll-option-b", optionB],
    ]) {
      if (!option.trim() || option.length > 255) {
        showFieldError(
          field,
          option.trim()
            ? "선택지는 255자 이하로 입력해주세요."
            : "선택지를 입력해주세요."
        );
        return false;
      }
    }
    return true;
  };

  const handleCompare = async () => {
    if (isComparing || isSaving || !validatePollText()) return;
    setIsComparing(true);
    setComparison(null);

    try {
      const { data } = await AxiosApi.comparePollDraft(comparisonInput);
      if (!data?.comparison?.trim()) {
        throw new Error("AI 비교 응답이 비어 있습니다.");
      }
      setComparison({ inputKey: comparisonInputKey, text: data.comparison });
    } catch {
      setComparison({
        inputKey: comparisonInputKey,
        error: "비교 결과를 불러오지 못했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsComparing(false);
    }
  };

  const handleCreate = async () => {
    if (isSaving || (isEdit && loadedId !== id)) return;
    setSaveError("");
    setFieldError(null);
    if (!validatePollText()) return;
    if (
      deadline === "" ||
      (deadline !== originalDeadline && new Date(deadline) <= new Date())
    ) {
      showFieldError("poll-deadline", "현재 이후의 마감일시를 선택해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      const options = [optionA, optionB];
      const tourOptions = [tourA, tourB].map((spot) =>
        spot ? { contentId: spot.contentId, imageUrl: spot.imageUrl } : null
      );
      if (isEdit) {
        await AxiosApi.pollUpdate(id, {
          title,
          content,
          options,
          deadline,
          contentImage,
          tourOptions,
        });
      } else {
        await AxiosApi.pollCreate(
          title,
          content,
          options,
          deadline,
          contentImage,
          tourOptions
        );
      }
      nav(isEdit ? `/votes/${id}` : "/");
    } catch (error) {
      console.error("투표 등록 실패:", error);
      const status = error.response?.status;
      setSaveError(
        status === 403
          ? "작성자만 수정할 수 있습니다."
          : status === 401
          ? "로그인이 필요합니다."
          : status === 409
          ? "참여자가 있는 투표는 마감일시만 수정할 수 있습니다. 페이지를 새로고침해주세요."
          : "투표를 저장하지 못했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && (loadError || loadedId !== id)) {
    return (
      <Container>
        <p>{loadError || "로딩 중..."}</p>
        <Button enabled size="short" onClick={() => nav(`/votes/${id}`)}>
          돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{isEdit ? "투표 수정" : "투표 등록"}</Title>

      <Form>
        <Field onClick={deadlineOnly ? redirectToDeadline : undefined}>
          <label htmlFor="poll-title">투표 제목</label>
          <Input
            id="poll-title"
            readOnly={deadlineOnly}
            aria-describedby={
              deadlineOnly
                ? "poll-deadline-hint"
                : errorFor("poll-title")
                ? "poll-title-error"
                : undefined
            }
            value={title}
            onChange={(e) =>
              updateField("poll-title", setTitle, e.target.value)
            }
            aria-invalid={Boolean(errorFor("poll-title"))}
            placeholder="투표 제목을 입력해주세요."
          />
          <FormFeedback id="poll-title-error">
            {errorFor("poll-title")}
          </FormFeedback>
        </Field>

        <OptionRow
          $locked={deadlineOnly}
          onClick={deadlineOnly ? redirectToDeadline : undefined}
        >
          <TourOptionField
            id="poll-option-a"
            label="선택지 A"
            value={optionA}
            onChange={(value) =>
              updateField("poll-option-a", setOptionA, value)
            }
            error={errorFor("poll-option-a")}
            selected={tourA}
            onSelect={setTourA}
            disabled={isSaving || deadlineOnly}
          />
          <TourOptionField
            id="poll-option-b"
            label="선택지 B"
            value={optionB}
            onChange={(value) =>
              updateField("poll-option-b", setOptionB, value)
            }
            error={errorFor("poll-option-b")}
            selected={tourB}
            onSelect={setTourB}
            disabled={isSaving || deadlineOnly}
          />
        </OptionRow>

        {!isEdit && (
          <ComparisonPreview>
            <ComparisonActions>
              {!hasComparisonInput && (
                <Description>
                  제목과 두 선택지를 입력하면 여행지 특징을 비교할 수 있어요.
                </Description>
              )}
              <ComparisonButton
                type="button"
                disabled={!hasComparisonInput || isComparing || isSaving}
                onClick={handleCompare}
              >
                {isComparing ? "비교 중…" : "여행지 비교"}
              </ComparisonButton>
            </ComparisonActions>
            <FormFeedback>{currentComparison?.error}</FormFeedback>
            {currentComparison?.text && (
              <ComparisonResult role="status" aria-label="AI 비교 결과">
                {currentComparison.text}
              </ComparisonResult>
            )}
          </ComparisonPreview>
        )}

        <Field onClick={deadlineOnly ? redirectToDeadline : undefined}>
          <label htmlFor="poll-content">내용 (선택)</label>
          <StyledTextarea
            id="poll-content"
            readOnly={deadlineOnly}
            aria-describedby={deadlineOnly ? "poll-deadline-hint" : undefined}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="투표에 대한 설명을 입력해주세요."
          />
        </Field>

        {(!deadlineOnly || contentImage) && (
          <CoverDetails>
            <summary>
              {contentImage ? "대표 사진 보기" : "대표 사진 추가"}
            </summary>
            <CoverBody>
              {isEdit && contentImage && (
                <img src={contentImage} alt="등록된 대표 사진" />
              )}
              {!deadlineOnly && <ImageUpload onImageSelect={setContentImage} />}
              {!deadlineOnly && isEdit && contentImage && (
                <Button
                  enabled={!isSaving}
                  size="small"
                  onClick={() => setContentImage(null)}
                >
                  사진 삭제
                </Button>
              )}
            </CoverBody>
          </CoverDetails>
        )}

        <DeadlineField>
          <label htmlFor="poll-deadline">투표 마감일시</label>
          <Input
            id="poll-deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) =>
              updateField("poll-deadline", setDeadline, e.target.value)
            }
            aria-invalid={Boolean(errorFor("poll-deadline"))}
            aria-describedby={
              errorFor("poll-deadline")
                ? "poll-deadline-error"
                : deadlineOnly
                ? "poll-deadline-hint"
                : undefined
            }
          />
          {deadlineOnly && (
            <Description
              id="poll-deadline-hint"
              $highlighted={showDeadlineHint}
              role="status"
            >
              이미 참여자가 있는 투표는 마감일시만 수정할 수 있어요.
            </Description>
          )}
          <FormFeedback id="poll-deadline-error">
            {errorFor("poll-deadline")}
          </FormFeedback>
        </DeadlineField>

        <FormFeedback>{saveError}</FormFeedback>
        <ButtonRow>
          {isEdit && (
            <Button
              enabled={!isSaving}
              size="short"
              onClick={() => nav(`/votes/${id}`)}
            >
              취소
            </Button>
          )}
          <Button enabled={!isSaving} size="short" onClick={handleCreate}>
            {isSaving ? "저장 중..." : isEdit ? "수정 저장" : "투표 등록"}
          </Button>
        </ButtonRow>
      </Form>
    </Container>
  );
};

export default PollCreate;
