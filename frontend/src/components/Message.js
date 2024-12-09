import React from 'react';
// import chatbotIcon from "./chatbot_icon.png";


function Message({sender, text, timestamp}) {
    const isUser = sender === 'user';

    const formattedTime = new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    // User일 때와 Chatbot일 때 메시지를 다르게 표시하도록 JSX 작성함
    // break-words: 긴 단어 자동으로 줄바꿈할 수 있도록 함
    // self-start: 아이콘 위쪽 정렬되도록
    return (
        <div className={`flex mb-2 ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && (
                <img
                    src='/chatbot_icon.png'
                    alt="Chatbot"
                    className='w-8 h-8 rounded-full mr-2 self-start'
                />
            )}
            <div className={`max-w-xs ${isUser ? "text-right" : "text-left"}`}>
                {!isUser && (
                <div className="text-sm text-gray-500 mb-1">Chatbot</div>
                )}
                <div
                    className={`rounded-lg px-4 py-2 max-w-xs min-w-24 break-words ${
                        isUser
                            ? "bg-blue-500 text-white text-right"
                            : "bg-gray-200 text-left"
                    }`}
                >
                    {/* <span className='block font-semibold'>
                        {isUser ? 'User' : 'Chatbot'}:
                    </span> */}
                    <span>{text}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{formattedTime}</div>
            </div>
        </div>
    );
}

export default Message;