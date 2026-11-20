from pydantic import BaseModel


# Python 서비스로 들어오는 여행 문서의 형식을 정의합니다.
# DB 테이블이 아니라, 요청 데이터의 항목과 자료형을 정하는 모델입니다.
class TravelDocument(BaseModel):
    content_id: str  # 관광지 ID
    title: str       # 관광지 이름
    content: str     # 청킹과 임베딩 대상이 될 설명 글
    source: str      # 정보 출처