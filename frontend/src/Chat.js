// frontend/src/Chat.js
import React, { useState, useEffect } from "react";
import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";

const Chat = ({ setIsAuthenticated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // 채팅 기록 불러오기
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get("/chat");
        setMessages(res.data.messages);
      } catch (err) {
        console.error("채팅 기록 불러오기 오류:", err);
      }
    };

    fetchChatHistory();
  }, []);

  // 메시지 전송
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // 서버에 사용자 메시지 저장
      await axios.post("/chat", { sender: "user", text: input });

      // 챗봇 응답 가져오기
      const res = await axios.post("/chatbot", { message: input });
      const botMessage = {
        sender: "bot",
        text: res.data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // 서버에 챗봇 응답 저장
      await axios.post("/chat", { sender: "bot", text: res.data.response });
    } catch (err) {
      console.error("챗봇과의 통신 오류:", err);
      const errorMessage = {
        sender: "bot",
        text: "죄송합니다. 문제가 발생했습니다.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      // 서버에 오류 메시지 저장
      await axios.post("/chat", {
        sender: "bot",
        text: "죄송합니다. 문제가 발생했습니다.",
      });
    }

    setInput("");
  };

  // 채팅 기록 초기화
  const newChat = async () => {
    try {
      await axios.delete("/chat/clear");
      setMessages([]);
    } catch (err) {
      console.error("채팅 기록 초기화 오류:", err);
    }
  };

  // 로그아웃 기능
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // 회원 탈퇴 기능
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "정말로 회원 탈퇴를 하시겠습니까? 모든 데이터가 삭제됩니다."
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete("/auth/delete");
      alert(res.data.message);
      // 토큰 제거 및 인증 상태 업데이트
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("회원 탈퇴 오류:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2>챗봇</h2>
        <div>
          <button
            onClick={newChat}
            style={{ padding: "5px 10px", marginRight: "10px" }}
          >
            새 채팅하기
          </button>
          <button
            onClick={logout}
            style={{ padding: "5px 10px", marginRight: "10px" }}
          >
            로그아웃
          </button>
          <button
            onClick={deleteAccount}
            style={{
              padding: "5px 10px",
              backgroundColor: "#ff4d4d",
              color: "#fff",
              border: "none",
              borderRadius: "3px",
            }}
          >
            회원 탈퇴
          </button>
        </div>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: msg.sender === "user" ? "#daf8cb" : "#f1f0f0",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={sendMessage}
        style={{ display: "flex", marginTop: "10px" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{ flex: 1, padding: "10px", boxSizing: "border-box" }}
        />
        <button type="submit" style={{ padding: "10px" }}>
          전송
        </button>
      </form>
    </div>
  );
};

export default Chat;
