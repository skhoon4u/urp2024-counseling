// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from '../axiosConfig';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate();

    // 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem("token"); // 토큰 삭제
        setIsAuthenticated(false); // 인증 상태 업데이트
        navigate("/login"); // 로그인 페이지로 리디렉션
    };

    // 회원 탈퇴 핸들러
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "정말로 회원 탈퇴를 하시겠습니까? 모든 데이터가 삭제됩니다."
        );
        if (!confirmDelete) return;

        try {
            await axios.delete("/auth/delete", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert("계정이 성공적으로 삭제되었습니다.");
            handleLogout(); // 로그아웃 처리
        } catch (err) {
            console.error("회원 탈퇴 오류:", err);
            alert("회원 탈퇴 중 오류가 발생했습니다.");
        }
    };

    // 상담하기 핸들러
    const handleNewChat = () => {
        // newChat(); // 대화 초기화
        navigate("/"); // 메인 화면으로 이동
    };

    return (
        <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">Emotional Support Chatbot</h1>
            <div className="flex space-x-4">
            

            {isAuthenticated ? (
                <>
                <button
                    onClick={() => navigate("/conversations")}
                    className="text-gray-700 hover:text-blue-500"
                >
                    대화 목록
              </button>
                <button 
                    onClick={handleNewChat}
                    className="text-gray-700 hover:text-blue-500"
                >
                    상담하기
                </button>
                <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-500"
                >
                    로그아웃
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className="text-red-600 hover:text-red-800 font-bold"
                >
                    회원 탈퇴
                </button>
                </>
            ) : (
                <>
                <Link to="/login" className="text-gray-700 hover:text-blue-500">
                    로그인
                </Link>
                <Link
                    to="/signup"
                    className="text-gray-700 hover:text-blue-500"
                >
                    회원가입
                </Link>
                </>
            )}
            </div>
        </div>
        </nav>
    );
}

export default Navbar;
