// frontend/src/components/Login.js
import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // CSS 파일 임포트 (필요 시 생성)

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
      setMessage(res.data.message);
      // 토큰 저장 (예: localStorage)
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      // 로그인 성공 후 Chat 페이지로 리디렉션
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h2>로그인</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>비밀번호:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          로그인
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
};

export default Login;
