// src/components/Chat.js
import React, { useState, useEffect, useRef } from "react";
import axios from "../axiosConfig";
import Message from "./Message";
import { useNavigate } from "react-router-dom";

const Chat = ({ setIsAuthenticated }) => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Feel free to talk to me!", timestamp: new Date() },
    ]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

     // 초기 채팅 기록 로드
    useEffect(() => {
        const fetchChatHistory = async () => {
        try {
            const response = await axios.get("/chat", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("채팅 기록 로드 오류:", error.response?.data || error.message);
        }
        };

        fetchChatHistory();
    }, []);

    const sendMessage = async (e) => {
        // 이벤트 객체 확인 후 preventDefault 호출
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (input.trim() === "") return;
        
        //사용자 메시지 추가
        const userMessage = {
            sender: "user",
            text: input,
            timestamp: Date.now(),
        };
        setMessages((prevMessages) => [
            ...prevMessages,
            userMessage 
        ]);

        try {
            // 서버에 사용자 메시지 저장
            await axios.post(
                "/chat",
                { sender: "user", text: input },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // 챗봇 응답 가져오기
            const res = await axios.post(
                "/chatbot",
                { message: input },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const botMessage = {
                sender: "bot",
                text: res.data.response,
                timestamp: Date.now(),
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

            // 서버에 챗봇 응답 저장
            await axios.post(
                "/chat",
                { sender: "bot", text: res.data.response },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
        } catch (err) {
            console.error("메시지 전송 오류:", err);
            const errorMessage = {
                sender: "bot",
                text: "죄송합니다. 문제가 발생했습니다.",
                timestamp: Date.now(),
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        setInput("");
    };

    const handleNewChat = async () => {
        try {
            // 현재 메시지 상태를 서버에 저장
            console.log("대화 저장 시작...");
            console.log("전송되는 messages 데이터:", messages);
             // 데이터 전송 시 `_id` 제거
            const sanitizedMessages = messages.map(({ sender, text, timestamp }) => ({
                sender,
                text,
                timestamp,
            }));
            console.log("전송되는 messages 데이터:", sanitizedMessages);
            const saveResponse = await axios.post(
                "/conversation/save",
                { messages: sanitizedMessages }, // 전체 메시지 배열 전송
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("대화 저장 성공:", saveResponse.data);
    
            // 기존 채팅 기록 삭제
            console.log("채팅 기록 삭제 시작...");
            const deleteResponse = await axios.delete("/chat/clear", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log("채팅 기록 삭제 성공:", deleteResponse.data);
    
            // 메시지 상태 초기화
            console.log("메시지 상태 초기화...");
            setMessages([
                { sender: "bot", text: "Feel free to talk to me!", timestamp: new Date() },
            ]);
            console.log("상태 초기화 완료");
        } catch (err) {
            console.error("새로운 상담 오류:", err.response?.data || err.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="flex flex-col h-full max-w-lg mx-auto p-4">
            {/* 새로운 상담 버튼 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">챗봇</h2>
                <button
                onClick={handleNewChat}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                새로운 상담
                </button>
            </div>
        <div className="h-144 overflow-y-auto mb-4 p-4 border border-gray-300 rounded bg-white">
            {messages.map((msg, index) => (
                <Message 
                    key={index} 
                    sender={msg.sender} 
                    text={msg.text}
                    timestamp={msg.timestamp} 
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="flex mt-2">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="메시지를 입력하세요..."
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            전송
            </button>
        </form>
        </div>
    );
}

export default Chat;
