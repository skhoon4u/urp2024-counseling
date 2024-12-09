// frontend/src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from "./Chat";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  // 인증 상태를 관리하는 state
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // 로컬 스토리지의 토큰 변경을 감지하여 인증 상태 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div>
        <h1 style={{ textAlign: "center" }}>챗봇</h1>
        <Routes>
          {/* 메인 페이지: 인증된 사용자는 Chat, 그렇지 않으면 Login으로 리디렉션 */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Chat setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 회원가입 페이지: 인증되지 않은 사용자만 접근 가능 */}
          <Route
            path="/signup"
            element={
              !isAuthenticated ? <Signup /> : <Navigate to="/" replace />
            }
          />

          {/* 로그인 페이지: 인증되지 않은 사용자만 접근 가능 */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* 모든 기타 경로는 메인 페이지로 리디렉션 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
