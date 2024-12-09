// frontend/src/components/Signup.js
import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signup", {
        username,
        email,
        password,
      });
      setMessage(res.data.message);
      // 회원가입 성공 후 로그인 페이지로 리디렉션
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("회원가입 중 오류가 발생했습니다.");
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
      <h2>회원가입</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>사용자 이름:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
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
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
