const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001; // React 프론트엔드가 3000 포트를 사용한다고 가정

app.use(cors());
app.use(express.json());

// 룰 베이스 응답 (초기 구현)
const ruleBaseResponses = {
  안녕: "안녕하세요! 무엇을 도와드릴까요?",
  "이름이 뭐야?": "저는 챗봇입니다.",
  "잘 가": "안녕히 가세요!",
};

// 채팅 엔드포인트
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  // 룰 베이스 응답 확인
  const ruleResponse = ruleBaseResponses[userMessage];
  if (ruleResponse) {
    return res.json({ response: ruleResponse });
  }

  // 룰 베이스에 없는 경우 BlenderBot 모델로 요청
  try {
    const botResponse = await axios.post("http://localhost:5001/api/chat", {
      message: userMessage,
    });
    return res.json({ response: botResponse.data.response });
  } catch (error) {
    console.error("Error communicating with BlenderBot service:", error);
    return res
      .status(500)
      .json({ error: "Failed to get response from chatbot model" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
