const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    sender: String, // 'user' hoặc 'admin'
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Thêm userId vào schema
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
