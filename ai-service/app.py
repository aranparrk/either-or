from fastapi import FastAPI, HTTPException
from openai import OpenAI

# 관광 문서 요청 형식과 청킹 함수를 가져옵니다.
from schemas import CompareRequest, CompareResult, TravelDocument
from chunker import split_text

# FastAPI 서버 앱을 만듭니다.
app = FastAPI(title="양자택일 RAG 서비스")


# 서버가 실행 중인지 확인하는 주소: GET /health
@app.get("/health")
def health_check():
    return {"status": "ok"}


# 청킹 결과를 미리 확인하는 주소: POST /chunk-preview
@app.post("/chunk-preview")
def chunk_preview(document: TravelDocument):
    # 문서의 설명(content)을 작은 조각으로 나눕니다.
    chunks = split_text(document.content)

    # 나눈 조각의 개수와 내용을 응답합니다.
    # 이 미리보기 API는 아직 임베딩하거나 저장하지 않습니다.
    return {
        "content_id": document.content_id,
        "chunk_count": len(chunks),
        "chunks": chunks,
    }


@app.post("/compare")
def compare_options(request: CompareRequest):
    prompt = f"""
    투표 제목: {request.poll_title}
    선택지 A: {request.option_a}
    선택지 A 관광지 소개: {request.option_a_overview.strip() or "제공된 소개 없음"}
    선택지 B: {request.option_b}
    선택지 B 관광지 소개: {request.option_b_overview.strip() or "제공된 소개 없음"}
    """
    with OpenAI() as client:
        response = client.responses.parse(
            model="gpt-5-mini",
            reasoning={"effort": "minimal"},
            input=prompt,
            instructions=(
                "투표 제목의 기준에 맞춰 선택지별 핵심 특징을 각각 1~3개 작성해. "
                "관광지 소개가 제공된 선택지는 그 소개에 근거해서 특징을 써. "
                "소개가 없는 선택지는 이름을 바탕으로 알고 있는 일반 정보만 써. "
                "각 특징은 짧은 한국어 한 문장으로 써. "
                "인사말, 별도의 주의사항, 후속 질문, 추가 도움 제안은 쓰지 마. "
                "장소를 특정하기 어려우면 해당 선택지에 그 사실만 한 문장으로 써."
            ),
            text_format=CompareResult,
        )

    result = response.output_parsed
    if result is None:
        raise HTTPException(status_code=502, detail="비교 결과를 생성하지 못했습니다.")

    option_a = "\n".join(f"- {point}" for point in result.option_a_points)
    option_b = "\n".join(f"- {point}" for point in result.option_b_points)
    return {"comparison": f"A. {request.option_a}\n{option_a}\n\nB. {request.option_b}\n{option_b}"}
