const express = require('express');
const { createMessage, getAllMessages, getMessagesByUserId } = require('../controllers/chatController');
const router = express.Router();


router.post('/chat', createMessage);
router.get('/messages', getAllMessages);
router.get('/messages/user/:userId', getMessagesByUserId);
module.exports = router;
