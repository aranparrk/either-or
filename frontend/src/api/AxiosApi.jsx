import axios from "axios";

// 기존 프론트 개발 서버의 프록시 설정 사용
const HM_DOMAIN = "/";

const api = axios.create({
  baseURL: HM_DOMAIN,
});

// 요청을 보내기 전에 JWT 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // 로그인·회원가입 등 인증 API에는 기존 토큰을 보내지 않음
  const isAuthRequest = config.url?.startsWith("/api/auth/");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 인증된 요청이 401로 거절되면 로그인 정보 초기화
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith("/api/auth/");

    if (
      error.response?.status === 401 &&
      !isAuthRequest &&
      localStorage.getItem("accessToken")
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("email");
      localStorage.removeItem("profileId");

      window.location.replace("/login");
    }

    return Promise.reject(error);
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
