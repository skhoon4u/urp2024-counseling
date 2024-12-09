// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (jwtSecret) {
  // jwtSecret을 인자로 받음
  return function (req, res, next) {
    // Authorization 헤더에서 토큰 가져오기
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "토큰이 없습니다. 접근이 금지되었습니다." });
    }
    const token = authHeader.split(" ")[1];

    // 토큰 검증
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ message: "토큰이 유효하지 않습니다." });
    }
  };
};
