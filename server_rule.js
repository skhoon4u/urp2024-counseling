// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001; // React 프론트엔드가 3000 포트를 사용한다고 가정

app.use(cors());
app.use(express.json());

// 룰 베이스 응답
const ruleBaseResponses = {
  안녕: "안녕하세요! 무엇을 도와드릴까요?",
  "이름이 뭐야?": "저는 챗봇입니다.",
  "잘 가": "안녕히 가세요!",
  // 추가적인 룰을 여기에 추가하세요
};

// 기본 응답
const defaultResponse =
  "죄송합니다. 이해하지 못했습니다. 다른 질문을 해주세요.";

// 채팅 엔드포인트
app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  // 룰 베이스 응답 확인 (정확히 일치하는 경우)
  const ruleResponse = ruleBaseResponses[userMessage.trim()];
  if (ruleResponse) {
    return res.json({ response: ruleResponse });
  }

  // 룰 베이스에 없는 경우 기본 응답 반환
  return res.json({ response: defaultResponse });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
