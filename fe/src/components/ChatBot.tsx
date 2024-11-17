import axios from 'axios';
import { useState, useEffect } from 'react';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [userId, setUserId] = useState(null); // Khởi tạo userId trong state

    // Lấy userId từ localStorage khi component được khởi tạo
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error("User ID not found in localStorage.");
        }
    }, []);

    // Hàm để gọi API lấy tất cả tin nhắn theo userId
    const fetchMessagesByUserId = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/messages/user/${userId}`);
            setMessages(response.data); // Cập nhật danh sách tin nhắn từ backend
        } catch (error) {
            console.error("Error fetching messages by userId:", error);
        }
    };

    // Gửi tin nhắn mới và cập nhật danh sách tin nhắn
    const sendMessage = async () => {
        const newMessage = { text: input, sender: 'user', userId }; // Đảm bảo rằng `userId` có giá trị hợp lệ
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput('');

        try {
            const response = await axios.post('http://localhost:8080/api/chat', { message: input, userId });

            // Sử dụng hàm callback để cập nhật state dựa trên state mới nhất
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: response.data.adminReply.text, sender: 'admin' } // Thêm tin nhắn trả lời tự động từ admin
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    // Hàm xử lý khi nhấn vào nút "Chat"
    const handleChatButtonClick = () => {
        setIsChatOpen(true);
        if (userId) {
            fetchMessagesByUserId(); // Gọi hàm fetchMessagesByUserId để lấy tin nhắn theo userId
        } else {
            console.error("User ID is not available.");
        }
    };
    return (
        <div>
            {/* Floating Chat Button */}
            {!isChatOpen && (
                <button
                    onClick={handleChatButtonClick} // Gọi hàm handleChatButtonClick khi nhấn
                    className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg flex items-center p-2 cursor-pointer"
                >
                    <span className="text-orange-500 text-lg mr-2">💬</span>
                    <span className="text-orange-500 font-semibold">Chat</span>
                </button>
            )}

            {/* Chat Interface */}
            {isChatOpen && (
                <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <div className="bg-blue-600 text-white p-4 flex items-center">
                        <div >
                            <img className="w-10 h-10 bg-gray-300 rounded-full mr-2" src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg" alt="" />
                        </div>
                        <div>
                            <p className="font-bold">Fashion Zone (Admin)</p>
                            <p className="text-sm">Offline</p>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="ml-auto text-white font-bold"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-4 h-80 overflow-y-auto space-y-2">

                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} `}>
                                {/* Hiển thị ảnh đại diện bên cạnh tin nhắn */}
                                {msg.sender !== 'user' && (
                                    <img
                                        src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg" // Thay bằng URL ảnh của admin
                                        alt="Admin Avatar"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                )}
                                <div
                                    className={`${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} px-4 py-2 rounded-lg max-w-xs`}
                                >
                                    {msg.text}
                                </div>
                                {msg.sender === 'user' && (
                                    <img
                                        src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg" // Thay bằng URL ảnh của user
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full ml-2"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center p-4 border-t">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            placeholder="Type a message..."
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBot