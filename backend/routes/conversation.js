// routes/conversation.js
const express = require("express");
const Conversation = require("../models/Conversation");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 대화내역 저장
router.post("/save", authMiddleware, async (req, res) => {
  const { messages } = req.body;

  try {
    const conversation = new Conversation({
      user: req.user.id,
      messages,
    });

    await conversation.save();
    res.json({ message: "대화내역이 저장되었습니다." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
});

// 대화내역 불러오기
router.get("/history", authMiddleware, async (req, res) => {
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

module.exports = router;
