import axios from "axios";

// 기존 프론트 개발 서버의 프록시 설정 사용
const HM_DOMAIN = "/";

const api = axios.create({
  baseURL: HM_DOMAIN,
});

// 요청을 보내기 전에 JWT 추가
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  // 로그인·회원가입 등 인증 API에는 기존 토큰을 보내지 않음
  const isPublicAuthRequest = [
      "/api/auth/login",
      "/api/auth/singup",
      "/api/auth/reissue"
  ].includes(config.url);

  if (accessToken && !isPublicAuthRequest) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise = null;

// 인증된 요청이 401로 거절되면 로그인 정보 초기화
api.interceptors.response.use(
  // 정상 응답이면 그대로 반환
  (response) => response,

  // 오류 응답이면 실행
  async (error) => {
    const originalRequest = error.config;

    // 로그인, 회원가입, 재발급 요청인지 확인
    const isAuthRequest = originalRequest?.url?.startsWith("/api/auth/");

    // 401 오류가 아니거나 인증 요청이거나, 이미 재시도한 요청이면 종료
    if (
      error.response?.status !== 401 ||
      isAuthRequest ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // 저장된 RefreshToken 가져오기
    const refreshToken = localStorage.getItem("refreshToken");

    // RefreshToken 없으면 로그아웃 처리
    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("email");
      localStorage.removeItem("profileId");

      window.location.replace("/login");
      return Promise.reject(error);
    }

    // 같은 요청 무한 재시도 방지
    originalRequest._retry = true;

    try {
      // 이미 재발급 요청이 진행 중이 아니라면 새로 요청
      if (!refreshPromise) {
        refreshPromise = api
            // 백엔드에 토큰재발급 요청
          .post("/api/auth/reissue", {
            refreshToken: refreshToken,
          })
          .then((response) => {
            const data = response.data;

            // 새 토큰 저장
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            return data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // 재발급 결과 기다리기
      const newAccessToken = await refreshPromise;

      // 원래 실패했던 요청에 새 Access Token 적용
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // 원래 요청 다시 실행
      return api(originalRequest);

    } catch (refreshError) {
      // 재발급 실패 시 로그인 정보 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("email");
      localStorage.removeItem("profileId");

      window.location.replace("/login");

      return Promise.reject(refreshError);
    }
  }
);

const AxiosApi = {
  // ====================================
  // 회원 / 로그인 API
  // ====================================

  // 이메일 중복 확인
  memberExist: async (email) => {
    return await api.get(`/api/auth/exists/${encodeURIComponent(email)}`);
  },

  // 회원가입
  memberSignup: async (email, pwd, profileId) => {
    return await api.post("/api/auth/signup", {
      email,
      pwd,
      profileId,
    });
  },

  // 로그인
  memberLogin: async (email, pwd) => {
    return await api.post("/api/auth/login", {
      email,
      pwd,
    });
  },

  // 로그아웃
  memberLogout: async () => {
    return await api.post("/api/auth/logout");
  },

  // ====================================
  // 투표 게시글 API
  // ====================================

  // 투표 목록 조회
  pollList: async () => {
    return await api.get("/api/votes");
  },

  // 투표 상세 조회
  pollDetail: async (id) => {
    return await api.get(`/api/votes/${id}`);
  },

  // 투표 등록
  pollCreate: async (title, content, options, deadline, contentImage) => {
    return await api.post("/api/votes", {
      title,
      content,
      options,
      deadline,
      contentImage,
    });
  },

  // ====================================
  // 투표 참여 API
  // ====================================

  // 투표 참여
  voteCreate: async (id, optionId) => {
    return await api.post(`/api/votes/${id}/choices`, {
      optionId,
    });
  },

  // 투표 결과 조회
  voteResult: async (pollId) => {
    return await api.get(`/api/votes/${pollId}/results`);
  },

  // 투표 선택 변경
  voteUpdate: async (id, optionId) => {
    return await api.put(`/api/votes/${id}/choices`, {
      optionId,
    });
  },

  // ====================================
  // 댓글 API
  // ====================================

  // 댓글 목록 조회
  commentList: async (pollId) => {
    return await api.get(`/api/votes/${pollId}/comments`);
  },

  // 댓글 등록
  commentCreate: async (pollId, content) => {
    return await api.post(`/api/votes/${pollId}/comments`, {
      content,
    });
  },
};

export default AxiosApi;
