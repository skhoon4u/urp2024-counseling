// backend/routes/chat.js
const express = require("express");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/auth");

module.exports = function (jwtSecret) {
  // jwtSecret을 인자로 받음
  const router = express.Router();

  // 채팅 기록 가져오기
  router.get("/", authMiddleware(jwtSecret), async (req, res) => {
    try {
      const chat = await Chat.findOne({ user: req.user.id }).populate("user", [
        "username",
        "email",
      ]);
      if (!chat) {
        return res.json({ messages: [] });
      }
      res.json({ messages: chat.messages });
    } catch (err) {
      console.error("채팅 기록 가져오기 오류:", err.message);
      res.status(500).send("서버 오류");
    }
  });

  // 새로운 메시지 추가하기
  router.post("/", authMiddleware(jwtSecret), async (req, res) => {
    const { sender, text } = req.body;

    if (!sender || !text) {
      return res.status(400).json({ message: "Sender and text are required." });
    }

    try {
      let chat = await Chat.findOne({ user: req.user.id });

      if (!chat) {
        // 채팅 기록이 없으면 새로 생성
        chat = new Chat({
          user: req.user.id,
          messages: [{ sender, text }],
        });
      } else {
        // 기존 채팅에 메시지 추가
        chat.messages.push({ sender, text });
      }

      await chat.save();
      res.json({ message: "Message saved successfully." });
    } catch (err) {
      console.error("메시지 저장 오류:", err.message);
      res.status(500).send("서버 오류");
    }
  });

  // 채팅 기록 삭제하기
  router.delete("/clear", authMiddleware(jwtSecret), async (req, res) => {
    try {
      await Chat.findOneAndDelete({ user: req.user.id });
      res.json({ message: "Chat history cleared successfully." });
    } catch (err) {
      console.error("채팅 기록 삭제 오류:", err.message);
      res.status(500).send("서버 오류");
    }
  });

  return router;
};
