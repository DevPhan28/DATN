const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    sender: { type: String, required: true, enum: ['user', 'admin'] },
    receiver: { type: String, required: true, enum: ['user', 'admin'] },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);
