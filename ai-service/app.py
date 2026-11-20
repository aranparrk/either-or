from fastapi import FastAPI

# 관광 문서 요청 형식과 청킹 함수를 가져옵니다.
from schemas import TravelDocument
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