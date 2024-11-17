const Message = require('../models/message');

const createMessage = async (req, res) => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).json({ error: "Message and userId are required" });
    }

    try {
        // Lưu tin nhắn của người dùng
        const newMessage = new Message({
            text: message,
            sender: 'user',
            userId: userId
        });
        await newMessage.save();

        // Tạo trả lời tự động từ admin
        const autoReply = new Message({
            text: "Cảm ơn bạn đã quan tâm, hiện tại Fashion zone đang không hoạt động. Chúng tôi sẽ trả lời bạn trong thời gian sớm nhất ạ!",
            sender: 'admin',
            userId: userId
        });
        await autoReply.save();

        // Trả về cả tin nhắn của người dùng và tin nhắn trả lời từ admin
        res.status(201).json({
            message: "Message saved successfully",
            userMessage: newMessage,
            adminReply: autoReply
        });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Failed to save message" });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
const getMessagesByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const messages = await Message.find({ userId: userId }); // Lấy tin nhắn theo userId
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages by userId:", error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

module.exports = {
    getMessagesByUserId,
    createMessage,
    getAllMessages
};
