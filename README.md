# ⚖️ 양자택일 (Either Or)

여행지 두 곳 중 어디로 갈지 고민될 때, 다른 사람들은 어떤 곳을 선택했는지 투표로 확인하고 의견을 나누는 서비스입니다.

한국관광공사 TourAPI에서 여행지를 찾아 투표 선택지로 등록할 수 있고, 직접 여행지를 입력해 투표를 만들 수도 있습니다.

## 이런 기능이 있어요

- 이메일이나 카카오·구글 계정으로 가입하고 로그인할 수 있어요.
- 두 여행지를 선택지로 등록해 투표를 만들 수 있어요.
- 투표에 참여하고, 마감 전에는 선택을 바꿀 수 있어요.
- 투표 결과와 댓글이 실시간으로 반영돼요.
- 주간 인기 투표와 이번 주 인기 여행지를 확인할 수 있어요.
- 투표를 즐겨찾기에 저장하고, 마이페이지에서 내 활동을 확인할 수 있어요.

## 사용 기술

| 구분 | 기술 |
|---|---|
| Frontend | React, JavaScript, Vite, React Router, styled-components, Axios |
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA |
| Database | MySQL |
| 인증 | JWT, OAuth2 Client (Kakao, Google) |
| 실시간 통신 | WebSocket, STOMP |
| 외부 서비스 | 한국관광공사 TourAPI, ImgBB |
| API 문서 | Swagger UI / OpenAPI |
| AI 서비스 | Python, FastAPI |

## 서비스 구성

React 화면에서 `/api` 요청은 Spring Boot로 전달되고, `/ws` 경로로 WebSocket/STOMP 연결을 합니다. 백엔드는 MySQL과 한국관광공사 TourAPI, ImgBB, 카카오·구글 로그인에 연결됩니다.

AI 서비스는 FastAPI로 별도 실행합니다. 현재는 상태 확인과 관광지 설명을 청크로 나누어 보는 API까지 구현되어 있습니다. 임베딩, 벡터 검색, AI 답변 생성과 프론트엔드 연결은 아직 구현되지 않았습니다.

## 실행 주소

| 서비스 | 주소 |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| AI Service | `http://localhost:8000` |
| AI API 문서 | `http://localhost:8000/docs` |

## 실행하기

### 준비물

- Node.js와 Yarn
- Java 21
- MySQL
- AI 서비스를 실행하려면 Python 3.12 환경

### 1. 저장소 내려받기

```bash
git clone https://github.com/aranparrk/either-or.git
cd either-or
```

### 2. 데이터베이스 준비

MySQL에 `either_or` 데이터베이스를 만들고, 저장소 루트의 `schema.sql`을 실행합니다.

```sql
CREATE DATABASE either_or;
```

백엔드는 테이블을 자동 생성하지 않고 기존 스키마를 확인하므로, 실행 전에 `schema.sql`을 적용해야 합니다.

### 3. 백엔드 환경 변수 설정

로컬 실행 환경에 다음 값을 설정합니다. 실제 비밀번호와 인증 키는 GitHub에 올리지 않습니다.

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

### 4. 백엔드 실행

IntelliJ IDEA에서 `backend` 폴더를 열고 `BackendApplication.java`를 실행하거나, 터미널에서 실행합니다.

```bash
cd backend
./gradlew bootRun
```

### 5. 프론트엔드 실행

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

AI 기능을 확인할 때만 별도로 실행합니다.

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## 데이터베이스

ERD는 저장소 루트의 `ERD.png`, MySQL 테이블 생성 스크립트는 `schema.sql`에서 확인할 수 있습니다.

| 테이블 | 저장하는 정보 |
|---|---|
| `member` | 회원과 프로필 정보 |
| `polls` | 투표 게시글 |
| `poll_options` | 투표 선택지와 여행지 정보 |
| `votes` | 회원별 투표 기록 |
| `comments` | 투표 댓글 |
| `favorites` | 회원별 즐겨찾기 |
| `social_account` | 카카오·구글 계정 연결 정보 |
| `refresh_token` | Refresh Token 정보 |

## 프로젝트 폴더 구조

```text
either-or/
├── ai-service/
│   ├── app.py
│   ├── chunker.py
│   ├── schemas.py
│   └── requirements.txt
├── backend/
│   ├── src/main/java/com/eitheror/backend/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── SwaggerConfig.java
│   │   │   └── WebSocketConfig.java
│   │   ├── constant/
│   │   │   ├── Authority.java
│   │   │   └── SocialProvider.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── CommentController.java
│   │   │   ├── FavoriteController.java
│   │   │   ├── ImageController.java
│   │   │   ├── MemberController.java
│   │   │   ├── MyPageController.java
│   │   │   ├── PollController.java
│   │   │   ├── SocialAuthController.java
│   │   │   ├── SocialCsrfController.java
│   │   │   ├── TourController.java
│   │   │   └── VoteController.java
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── BackendApplication.java
│   ├── src/main/resources/application.properties
│   ├── src/test/java/com/eitheror/backend/
│   ├── build.gradle
│   └── gradlew
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── AxiosApi.jsx
│   │   │   └── currentMemberId.js
│   │   ├── assets/profiles/
│   │   │   ├── profile1.png
│   │   │   ├── profile2.png
│   │   │   ├── profile3.png
│   │   │   ├── profile4.png
│   │   │   └── profile5.png
│   │   ├── components/
│   │   │   ├── comment/CommentItem.jsx
│   │   │   ├── common/
│   │   │   ├── myPage/
│   │   │   └── poll/
│   │   ├── layouts/MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── MyPage.jsx
│   │   │   ├── PollCreate.jsx
│   │   │   ├── PollDetail.jsx
│   │   │   ├── PollList.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── SocialLoginCallback.jsx
│   │   │   └── SocialSignUp.jsx
│   │   ├── util/auth.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── package.json
│   ├── vite.config.js
│   └── yarn.lock
├── ERD.png
├── schema.sql
└── README.md
```

`backend/src/main/java`의 DTO·Entity·Repository·Security·Service 클래스와 `frontend/src/components`의 개별 컴포넌트는 각 폴더에서 확인할 수 있습니다.
