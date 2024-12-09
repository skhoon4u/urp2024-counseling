// frontend/src/axiosConfig.js
import axios from "axios";

// 인스턴스 생성
const instance = axios.create({
  baseURL: "http://localhost:3001/api", // 백엔드 서버의 주소와 포트
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰이 유효하지 않거나 만료되었을 때 로그아웃 처리
      localStorage.removeItem("token");
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      // 로그인 페이지로 리디렉션
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
