// src/components/Login.js
import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      // 토큰 저장 및 인증 상태 업데이트
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      navigate("/"); // 로그인 성공 시 메인으로 이동
    } catch (err) {
      setMessage(
        err.response?.data?.message || "로그인 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">이메일:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold">비밀번호:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          로그인
        </button>
      </form>
      <p className="text-center mt-4">
        아직 계정이 없으신가요?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
          회원가입
        </Link>
      </p>
    </div>
  );
};

export default Login;
