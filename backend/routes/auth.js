// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat"); // Chat 모델 임포트
const authMiddleware = require("../middleware/auth");

module.exports = function (jwtSecret) {
  // jwtSecret을 인자로 받음
  const router = express.Router();

  // 회원가입
  router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Signup 요청:", { username, email });

    try {
      // 이미 존재하는 사용자 확인
      let user = await User.findOne({ email });
      if (user) {
        console.log("이미 등록된 이메일:", email);
        return res.status(400).json({ message: "이미 등록된 이메일입니다." });
      }

      user = await User.findOne({ username });
      if (user) {
        console.log("이미 사용 중인 사용자 이름:", username);
        return res
          .status(400)
          .json({ message: "이미 사용 중인 사용자 이름입니다." });
      }

      // 새 사용자 생성
      const newUser = new User({
        username,
        email,
        password,
      });

      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      console.log("새 사용자 생성:", newUser.id);

      // JWT 토큰 생성
      const payload = {
        user: {
          id: newUser.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          console.error("JWT 생성 오류:", err);
          throw err;
        }
        console.log("회원가입 성공, 토큰 발급:", token);
        res.json({ token, message: "회원가입이 성공적으로 완료되었습니다." });
      });
    } catch (err) {
      console.error("회원가입 오류:", err.message);
      res.status(500).send("서버 오류");
    }
  });

  // 로그인
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("Login 요청:", { email });

    try {
      // 사용자 존재 여부 확인
      const user = await User.findOne({ email });
      if (!user) {
        console.log("존재하지 않는 이메일:", email);
        return res
          .status(400)
          .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
      }

      // 비밀번호 일치 여부 확인
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("비밀번호 불일치:", email);
        return res
          .status(400)
          .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
      }

      // JWT 토큰 생성
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          console.error("JWT 생성 오류:", err);
          throw err;
        }
        console.log("로그인 성공, 토큰 발급:", token);
        res.json({ token, message: "로그인이 성공적으로 완료되었습니다." });
      });
    } catch (err) {
      console.error("로그인 오류:", err.message);
      res.status(500).send("서버 오류");
    }
  });

  // 회원 탈퇴
  router.delete("/delete", authMiddleware(jwtSecret), async (req, res) => {
    try {
      const userId = req.user.id;

      // 사용자 삭제
      await User.findByIdAndDelete(userId);
      console.log(`사용자 삭제: ${userId}`);

      // 사용자 채팅 기록 삭제
      await Chat.findOneAndDelete({ user: userId });
      console.log(`채팅 기록 삭제: 사용자 ID ${userId}`);

      res.json({ message: "회원 탈퇴가 성공적으로 완료되었습니다." });
    } catch (err) {
      console.error("회원 탈퇴 오류:", err.message);
      res.status(500).send("서버 오류");
    }
  });

  return router;
};
