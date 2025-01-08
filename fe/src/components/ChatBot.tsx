import instance from '@/api/axiosIntance';
import { useSocket } from '@/data/socket/useSocket'; // Đảm bảo rằng bạn đã cấu hình socket context
import { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
    const [messages, setMessages] = useState([]); // Lưu trữ danh sách tin nhắn
    const [input, setInput] = useState(''); // Lưu trữ nội dung nhập từ người dùng
    const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái mở/đóng khung chat
    const [userId, setUserId] = useState(null); // Lưu trữ ID người dùng
    const socket = useSocket(); // Lấy kết nối socket từ context
    const messagesEndRef = useRef(null); // Tham chiếu đến phần tử chứa tin nhắn

    // Khởi tạo userId từ localStorage hoặc tạo mới
    useEffect(() => {
        let storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            storedUserId = `user_${Date.now()}`;
            localStorage.setItem('userId', storedUserId);
        }
        setUserId(storedUserId);

        // Lắng nghe sự kiện nhận tin nhắn từ server
        socket.on('receive-message', (data) => {
            // Kiểm tra nếu tin nhắn phù hợp với userId hiện tại và chỉ khi chat đang mở
            if (data && data._id && data.userId === userId && isChatOpen) {
                setMessages((prevMessages) => {
                    // Kiểm tra xem tin nhắn đã có trong danh sách chưa
                    if (!prevMessages.find(msg => msg._id === data._id)) {
                        return [...prevMessages, data]; // Thêm tin nhắn mới nếu chưa có
                    }
                    return prevMessages; // Không làm gì nếu tin nhắn đã có
                });
            }
        });

        // Dọn dẹp khi component bị unmount
        return () => {
            socket.off('receive-message');
        };
    }, [socket, userId, isChatOpen]);

    // Hàm gọi API để lấy tất cả tin nhắn theo userId
    const fetchMessagesByUserId = async () => {
        try {
            if (userId) {
                const response = await instance.get(`/messages/user/${userId}`);
                setMessages(response.data); // Cập nhật danh sách tin nhắn từ backend
            }
        } catch (error) {
            console.error('Error fetching messages by userId:', error);
        }
    };

    // Hàm lưu tin nhắn vào localStorage
    const saveMessagesToLocalStorage = (messages) => {
        localStorage.setItem('messages', JSON.stringify(messages)); // Lưu tin nhắn vào localStorage
    };

    // Hàm tải tin nhắn từ localStorage
    const loadMessagesFromLocalStorage = () => {
        const storedMessages = localStorage.getItem('messages');
        return storedMessages ? JSON.parse(storedMessages) : [];
    };

    // Sử dụng trong useEffect để tải tin nhắn khi mở chat
    useEffect(() => {
        if (isChatOpen) {
            const storedMessages = loadMessagesFromLocalStorage();
            setMessages(storedMessages);
        }
    }, [isChatOpen]);

    // Cập nhật lại tin nhắn trong localStorage khi có thay đổi
    useEffect(() => {
        if (messages.length > 0) {
            saveMessagesToLocalStorage(messages); // Lưu tin nhắn khi state thay đổi
        }
    }, [messages]);

    // Hàm gửi tin nhắn mới
    const sendMessage = async () => {
        const trimmedMessage = input.trim(); // Loại bỏ khoảng trắng thừa ở đầu và cuối tin nhắn

        if (!trimmedMessage) return; // Nếu tin nhắn rỗng sau khi loại bỏ khoảng trắng, không gửi

        const newMessage = { text: trimmedMessage, sender: 'user', userId };

        try {
            // Gửi tin nhắn của người dùng qua API
            const response = await instance.post('/chat', { message: trimmedMessage, userId });

            // Phát sự kiện với tin nhắn người dùng
            socket.emit('admin-send-message', { ...response.data.userMessage });

            // Cập nhật lại mảng tin nhắn khi nhận được phản hồi từ API
            setMessages((prevMessages) => [...prevMessages, response.data.userMessage]);

            setInput(''); // Reset input
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Hàm mở khung chat và tải tin nhắn
    const handleChatButtonClick = () => {
        setIsChatOpen(true);
        fetchMessagesByUserId(); // Lấy tin nhắn của người dùng khi mở chat
    };

    // Hàm cuộn đến tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Sử dụng useEffect để cuộn đến tin nhắn mới nhất khi danh sách tin nhắn thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div>
            {/* Nút mở khung chat */}
            {!isChatOpen && (
                <button
                    onClick={handleChatButtonClick}
                    className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg flex items-center p-2 cursor-pointer"
                >
                    <span className="text-orange-500 text-lg mr-2">💬</span>
                    <span className="text-orange-500 font-semibold">Chat</span>
                </button>
            )}

            {/* Giao diện khung chat */}
            {isChatOpen && (
                <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <div className="bg-blue-600 text-white p-4 flex items-center">
                        <img
                            className="w-10 h-10 bg-gray-300 rounded-full mr-2"
                            src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg"
                            alt="Admin"
                        />
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
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender !== 'user' && (
                                    <img
                                        src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg"
                                        alt="Admin Avatar"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                )}
                                <div
                                    className={`${
                                        msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                    } px-4 py-2 rounded-lg max-w-xs`}
                                >
                                    {msg.text}
                                </div>
                                {msg.sender === 'user' && (
                                    <img
                                        src="https://via.placeholder.com/150" // Placeholder image cho user
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full ml-2"
                                    />
                                )}
                            </div>
                        ))}
                        {/* Phần tử để cuộn đến */}
                        <div ref={messagesEndRef} />
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
    );
};

export default ChatBot;
