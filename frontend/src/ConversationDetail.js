import React, { useState, useEffect } from "react";
import axios from "./axiosConfig";
import { useParams, Link } from "react-router-dom";

const ConversationDetail = () => {
    const { id } = useParams(); 
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchConversationDetail = async () => {
        try {
            const response = await axios.get(`/conversation/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            });
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("대화 세부 정보 오류:", error.response?.data || error.message);
        }
        };

        fetchConversationDetail();
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">대화 내용</h2>
        <div className="bg-white p-4 border border-gray-300 rounded">
            {messages.length > 0 ? (
            messages.map((msg, index) => (
                <div
                key={index}
                className={`mb-2 p-2 rounded ${
                    msg.sender === "user" ? "bg-blue-100 text-right" : "bg-gray-200"
                }`}
                >
                <p>{msg.text}</p>
                </div>
            ))
            ) : (
            <p>대화 내용을 불러오는 중...</p>
            )}
        </div>
        <Link
            to="/conversations"
            className="mt-4 inline-block text-blue-500 hover:underline"
        >
            대화 목록으로 돌아가기
        </Link>
        </div>
    );
};

export default ConversationDetail;
