// backend/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// JWT_SECRET을 .env에서 읽지 않고, 서버 시작 시 랜덤하게 생성
const jwtSecret = crypto.randomBytes(64).toString("hex");
console.log(`동적으로 생성된 JWT_SECRET: ${jwtSecret}`);

// CORS 옵션 설정
const corsOptions = {
  origin: "http://localhost:3000", // React 프론트엔드 주소
  methods: "GET,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json());

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => {
    console.error("MongoDB 연결 오류:", err);
    process.exit(1);
  });

// 라우트 가져오기
const authRoutes = require("./routes/auth")(jwtSecret); // auth 라우트에 jwtSecret 전달
const conversationRoutes = require("./routes/conversation");
const chatRoutes = require("./routes/chat")(jwtSecret); // 채팅 라우트에 jwtSecret 전달

// 라우트 사용
app.use("/api/auth", authRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/chat", chatRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("백엔드 서버가 정상적으로 작동 중입니다.");
});

// rule base response
const ruleBaseResponses = {
  안녕: "안녕하세요! 무엇을 도와드릴까요?",
  "이름이 뭐야?": "저는 챗봇입니다.",
  "잘 가": "안녕히 가세요!",
};

// 채팅 엔드포인트
app.post("/api/chatbot", async (req, res) => {
  // 기존 챗봇 엔드포인트 변경
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  const ruleResponse = ruleBaseResponses[userMessage];
  if (ruleResponse) {
    return res.json({ response: ruleResponse });
  }

  try {
    const botResponse = await axios.post("http://localhost:5001/api/chat", {
      message: userMessage,
    });
    return res.json({ response: botResponse.data.response });
  } catch (error) {
    console.error("BlenderBot 서비스와의 통신 오류:", error);
    return res
      .status(500)
      .json({ error: "챗봇 모델로부터 응답을 받지 못했습니다." });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
