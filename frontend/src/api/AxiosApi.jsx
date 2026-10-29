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
};

export default AxiosApi;
