import React, { useState, useEffect } from "react";
import axios from "./axiosConfig";
import { Link } from "react-router-dom";

const ConversationList = () => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
        try {
            const response = await axios.get("/conversation/history", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            });
            setConversations(response.data || []);
        } catch (error) {
            console.error("대화 목록 조회 오류:", error.response?.data || error.message);
        }
        };

        fetchConversations();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">대화 목록</h2>
        <ul className="divide-y divide-gray-300">
            {conversations.map((conv, index) => (
            <li key={conv._id} className="py-4">
                <Link
                to={`/conversations/${conv._id}`}
                className="text-blue-500 hover:underline"
                >
                대화 시작 시간: {new Date(conv.createdAt).toLocaleString()}
                </Link>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default ConversationList;
