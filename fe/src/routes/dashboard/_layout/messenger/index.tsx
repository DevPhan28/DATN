import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import Header from '@/components/layoutAdmin/header/header';
export const Route = createFileRoute('/dashboard/_layout/messenger/')({
  component: Messenger,
})

function Messenger() {
  const [activeChat, setActiveChat] = useState("trung V2");
  const [newMessage, setNewMessage] = useState(""); // State để lưu tin nhắn mới

  const [chats, setChats] = useState([
    { id: "trung V2", name: "trung V2", lastMessage: "chào bạn nhé", messages: ["Xin chào quý khách đến với cửa hàng NUCSHOP"] },
    { id: "vantuyen", name: "vantuyen", lastMessage: "zề", messages: ["Xin chào, tôi là vantuyen"] },
  ]);

  const activeChatData = chats.find(chat => chat.id === activeChat);

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Cập nhật mảng messages của cuộc trò chuyện đang active
      const updatedChats = chats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage], // Thêm tin nhắn mới vào messages
            lastMessage: newMessage, // Cập nhật lastMessage của cuộc trò chuyện
          };
        }
        return chat;
      });

      setChats(updatedChats); // Cập nhật lại chats với mảng tin nhắn mới
      setNewMessage(""); // Reset input sau khi gửi
    }
  };

  return (
    <div>
      <Header title="Trò Chuyện" pathname="" />
      <div className="bg-gray-100 h-[650px] flex  justify-center p-2">
        <div className="w-full bg-white shadow-md rounded-lg flex">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-lg font-bold">Messages</h1>
            </div>
            <ul className="overflow-y-auto h-[calc(100vh-80px)]">
              {chats.map(chat => (
                <li
                  key={chat.id}
                  className={`px-4 py-3 flex items-center hover:bg-gray-100 cursor-pointer ${activeChat === chat.id ? "bg-gray-100" : ""
                    }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white mr-4">
                    {chat.name.charAt(0).toLowerCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{chat.name}</p>
                    <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Area */}
          <div className="w-2/3 flex flex-col">
            {/* Chat Header */}
            <div className="p-[16.5px] border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white mr-4">
                {activeChatData.name.charAt(0).toLowerCase()}
              </div>
              <div>
                <p className="font-semibold">{activeChatData.name}</p>
                <p className="text-sm text-gray-500">{activeChatData.lastMessage}</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeChatData.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${index % 2 === 0 ? "items-start" : "items-end justify-end"} mb-4`}
                >
                  {index % 2 === 0 && (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white mr-4">
                      {activeChatData.name.charAt(0).toLowerCase()}
                    </div>
                  )}
                  <div
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-purple-500 text-white"
                      } p-3 rounded-lg`}
                  >
                    <p>{message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)} // Cập nhật state khi người dùng nhập tin nhắn
                placeholder="Type your message here..."
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                className="ml-4 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
                onClick={handleSendMessage} // Gửi tin nhắn khi click nút "Send"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
