# ⚖️ 양자택일 (Either Or)

**React와 Spring Boot로 만든 여행지 비교·투표 커뮤니티**

여행지 두 곳 중 어디가 더 끌리는지 투표하고, 다른 사람들의 선택과 의견을 확인해 보세요. <br>
한국관광공사 TourAPI에서 여행지를 찾아 투표 선택지로 등록할 수 있습니다.

## 주요 기능

- 이메일, 카카오·구글 계정 회원가입 및 로그인
- 여행지 두 곳을 선택지로 등록해 투표 만들기
- TourAPI 여행지 검색 및 상세 정보 연결
- 투표 참여, 마감 전 선택 변경, 결과 확인
- 투표 게시글과 댓글 작성·수정·삭제
- WebSocket/STOMP를 통한 투표 결과와 댓글 실시간 갱신
- 투표 검색, 진행 상태 필터, 최신순·인기순 정렬
- 주간 인기 투표와 이번 주 인기 여행지 확인
- 즐겨찾기 및 마이페이지에서 내 투표·댓글 확인

## 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React, JavaScript, Vite, React Router, styled-components, Axios |
| Backend | Java 21, Spring Boot 4.0.8, Spring Security, Spring Data JPA |
| Database | MySQL |
| 인증 | JWT, OAuth2 Client |
| 실시간 통신 | WebSocket, STOMP |
| 외부 서비스 | 한국관광공사 TourAPI, ImgBB |
| API 문서 | Swagger UI / OpenAPI |
| AI 서비스 | Python, FastAPI |

## 실행 방법

### 준비 사항

- Node.js 24
- Yarn 1.x
- Java 21
- MySQL

### 1. 저장소 Clone

```bash
git clone https://github.com/aranparrk/either-or.git
cd either-or
```

### 2. 데이터베이스 준비

MySQL에 `either_or` 데이터베이스를 만들고, 저장소의 `schema.sql`을 실행합니다.

```sql
CREATE DATABASE either_or;
```

백엔드의 `ddl-auto` 설정은 기존 테이블 구조를 확인하므로, 서버를 실행하기 전에 스키마를 적용해야 합니다.

### 3. 환경 변수 설정

백엔드 실행 환경에 아래 값을 설정합니다. IntelliJ IDEA에서는 실행 설정의 Environment variables에 등록할 수 있습니다.

```text
DB_PASSWORD
JWT_SECRET
KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
TOUR_API_KEY
IMGBB_API_KEY
```

인증 키와 비밀번호는 GitHub에 올리지 않습니다.

### 4. Backend 실행

IntelliJ IDEA에서 `backend` 프로젝트를 열고 `BackendApplication.java`를 실행하거나, 터미널에서 실행합니다.

```bash
cd backend
./gradlew bootRun
```

### 5. Frontend 실행

```bash
cd frontend
yarn install --frozen-lockfile
yarn dev
```

ESLint 검사는 다음 명령으로 실행할 수 있습니다.

```bash
yarn lint
```

### 6. AI 서비스 실행

AI 서비스를 확인할 때 별도로 실행합니다.

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## 데이터베이스 및 설계 자료

- `schema.sql`: MySQL 테이블 생성 스크립트
- `ERD.png`: 데이터베이스 ERD

주요 테이블은 회원, 투표 게시글, 투표 선택지, 투표 기록, 댓글, 즐겨찾기, 소셜 계정, Refresh Token으로 구성되어 있습니다.

## AI 서비스 진행 상황

FastAPI 서비스에 `GET /health`와 `POST /chunk-preview` API가 구현되어 있습니다. 임베딩, 벡터 검색, 답변 생성과 프론트엔드 연동은 아직 구현되지 않았습니다.

## 팀원

- [박아란](https://github.com/aranparrk) — 프로젝트 주요 기능 개발 및 통합
- [이영채](https://github.com/DDD134-alt) — 서비스 설계, 회원가입·로그인·회원정보 수정·검색 기능 개발
- [이도윤](https://github.com/doyoon61) — 댓글·마이페이지·즐겨찾기 기능 개발, 디자인 논의

프론트엔드와 백엔드를 따로 나누지 않고, 기능 단위로 함께 개발했습니다.
