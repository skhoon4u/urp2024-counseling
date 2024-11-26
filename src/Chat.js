// src/Chat.js
import React, { useState } from "react";
import axios from "axios";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // 사용자 메시지 추가
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      console.log(`React: 백엔드로 메시지 전송: ${input}`);
      // 백엔드로 메시지 전송
      const response = await axios.post("http://localhost:3001/api/chat", {
        message: input,
      });
      const botMessage = response.data.response;
      console.log(`React: 백엔드로부터 응답 받음: ${botMessage}`);

      // 챗봇 응답 추가
      setMessages([...newMessages, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "죄송합니다. 오류가 발생했습니다." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            <strong>{msg.sender === "user" ? "사용자" : "챗봇"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.input}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage} style={styles.button}>
          전송
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  userMessage: {
    textAlign: "right",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#DCF8C6",
    borderRadius: "10px",
    display: "inline-block",
  },
  botMessage: {
    textAlign: "left",
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#FFF",
    borderRadius: "10px",
    display: "inline-block",
  },
  inputArea: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Chat;
