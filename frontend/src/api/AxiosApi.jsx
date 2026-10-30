import axios from "axios";

// Spring Boot 서버 주소
const HM_DOMAIN = "http://localhost:8080";

// 세션 쿠키를 포함하여 요청
const api = axios.create({
  baseURL: HM_DOMAIN,
  withCredentials: true,
});

const AxiosApi = {
  // ====================================
  // 로그인 API
  // ====================================

  // 회원가입여부확인(GET)
  memberExist: async (email) => {
    return await api.get(`/api/auth/exists/${email}`);
  },

  // 회원가입(POST)
  memberSignup: async (email, pwd, profileId) => {
    return await api.post("/api/auth/signup", {
      email,
      pwd,
      profileId,
    });
  },

  // 로그인(POST)
  memberLogin: async (email, pwd) => {
    return await api.post("/api/auth/login", { email, pwd });
  },

  // 로그아웃(POST)
  memberLogout: async () => {
    return await api.post("/api/auth/logout");
  },

  // ====================================
  // 투표 게시글 API
  // ====================================

  // 투표 목록 조회 (GET)
  pollList: async () => {
    return await api.get("/api/votes");
  },

  // 투표 상세 조회 (GET)
  pollDetail: async (id) => {
    return await api.get(`/api/votes/${id}`);
  },

  // 투표 등록 (POST)
  pollCreate: async (title, content, options, deadline) => {
    return await api.post("/api/votes", {
      title,
      content,
      options,
      deadline,
    });
  },

  // 투표 참여 (POST)
  voteCreate: async (id, optionId) => {
    return await api.post(`/api/votes/${id}/choices`, {
      optionId,
    });
  },

  // 투표 결과 조회 (GET)
  voteResult: async (pollId) => {
    return await api.get(`/api/votes/${pollId}/results`);
  },
};

export default AxiosApi;
