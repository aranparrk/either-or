# 긴 글을 작은 조각으로 나누는 간단한 연습용 함수입니다.
def split_text(text, chunk_size=500, overlap=50):
    chunks = []
    start = 0

    # 아직 처리하지 않은 글자가 남아 있는 동안 반복합니다.
    while start < len(text):
        # 현재 조각이 끝날 위치를 계산합니다.
        end = start + chunk_size

        # 현재 위치부터 끝 위치 전까지를 조각으로 저장합니다.
        chunks.append(text[start:end])

        # 다음 조각이 앞 조각의 끝부분과 겹치도록 시작 위치를 조정합니다.
        start = end - overlap

    return chunks