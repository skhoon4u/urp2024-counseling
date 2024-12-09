// routes/conversation.js
const express = require("express");
const Conversation = require("../models/Conversation");
const authMiddleware = require("../middleware/auth");

module.exports = function (jwtSecret) {
  const router = express.Router();

  // 대화내역 저장
  router.post("/save", authMiddleware(jwtSecret), async (req, res) => {
    
    try {
      const { messages } = req.body;
      console.log("저장 요청 메시지:", messages); // 추가
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid messages format" });
      }

      const conversation = new Conversation({
        user: req.user.id,
        messages,
      });

      await conversation.save();
      console.log("대화 저장 성공:", conversation); // 추가

      res.json({ message: "대화내역이 저장되었습니다." });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  });

  // 대화내역 불러오기
  router.get("/history", authMiddleware(jwtSecret), async (req, res) => {
    try {
      const conversations = await Conversation.find({ user: req.user.id }).sort({
        createdAt: -1,
      });
      res.json(conversations);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  });

  return router;
};
